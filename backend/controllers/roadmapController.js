import { GoogleGenerativeAI } from '@google/generative-ai';
import Roadmap from '../models/roadmap.js';
import { configDotenv } from 'dotenv';

configDotenv(); // Load environment variables from .env file

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractJSON(text) {
  text = text.replace(/```json|```/g, '').trim(); // Remove backticks

  try {
    return JSON.parse(text); // Try parsing directly
  } catch (err) {
    // Try to extract first JSON object if extra text exists
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (err2) {
        return null;
      }
    }
    return null;
  }
}


// --- API Route for Generating a Roadmap ---
export const generateRoadmap = async (req, res) => {
    const { topic , week} = req.body;

    // Basic validation to ensure a topic was provided
    if (!topic || (week <= 0 || week > 52)) {
        return res.status(400).json({ error: "The 'topic' field is required and 'week' must be a positive number between 1 and 52." });
    }

    try {
        // 1. Use the model that we confirmed is working from the test script.
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const validationPrompt = `Is the topic '${topic}' a technical skill, a scientific concept, an academic subject, or a professional field that can have a structured learning roadmap? Personal names, fictional characters, or general places are not valid topics for this purpose. Please answer with only the word "yes" or "no".`;
        // Corrected validation logic
        const validationResult = await model.generateContent(validationPrompt);
        const validationResponse = await validationResult.response;
        const validationText = await validationResponse.text();

        if (validationText.toLowerCase().trim().includes("no")) {
            return res.status(400).json({ error: "The provided topic is not valid..." });
        }
                
        // 2. Craft the prompt
        const prompt = `
          Create a detailed, ${week}-week learning roadmap for a beginner on the topic of '${topic}'.
          IMPORTANT: If the topic '${topic}' is a person's name, a place, or a concept for which a technical or academic learning roadmap is not possible, your entire response MUST be a JSON object with a single key "error" and a value of "A learning roadmap cannot be created for this topic."
          Your response MUST be a valid JSON object. Do not include any text or markdown formatting before or after the JSON.
          The JSON object should have a single key "roadmap" which is an object containing a "title" and a "weeks" array.
          The "weeks" array MUST contain exactly ${week} object(s). For short durations like 1 or 2 weeks, you MUST consolidate the most important concepts into a single, cohesive plan for each week. Do not create multiple "Week 1" sections.
          Each object in the "weeks" array should have a "week" number, a "focus" string, and a "concepts" array of strings.

          Example format:
          {
            "roadmap": {
              "title": "${week}-Week Beginner's Roadmap to ${topic}",
              "weeks": [
                {
                  "week": 1,
                  "focus": "Week 1 Main Focus",
                  "concepts": ["Concept A", "Concept B", "Concept C"]
                },
                {
                  "week": 2,
                  "focus": "Week 2 Main Focus",
                  "concepts": ["Concept D", "Concept E", "Concept F"]
                }
              ]
            }
          }`;
        // 3. Generate content
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        // 4. Extract the text from the response
        
        const text = response.text();
        const jsonData = extractJSON(text);
        
       // This is a conceptual example
        const newRoadmap = await Roadmap.create({ user: req.user._id , topic: topic, roadmap: jsonData.roadmap,});

        // Send the NEWLY SAVED document back to the client
        res.status(201).json(newRoadmap);

    } catch (error) {
        // Log the full error for debugging on the server
        console.error("Error generating roadmap:", error);
        // Send a generic error message to the client
        return res.status(500).json({ error: "Failed to generate roadmap" });
    }
};


// --- API Route for Fetching a User's Saved Roadmaps ---
export const getUserRoadmaps = async (req, res) => {
    try {
        // 1. The user's ID is attached to the request by the 'protect' middleware.
        const userId = req.user._id;

        // 2. Find all roadmaps in the database where the 'user' field matches the logged-in user's ID.
        const roadmaps = await Roadmap.find({ user: userId }).sort({ createdAt: -1 });

        // 3. Send the found roadmaps back to the client.
        res.status(200).json(roadmaps);
        

    } catch (error) {
        console.error("Error fetching user roadmaps:", error);
        res.status(500).json({ message: "Server error while fetching roadmaps" });
    }
};


export const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (roadmap.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await roadmap.deleteOne();

    res.status(200).json({ message: 'Roadmap deleted successfully', id: req.params.id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const chatWithMentor = async (req, res) => {
  const { userQuestion, chatHistory, roadmap } = req.body;

  if (!userQuestion || !roadmap || !roadmap.title) {
    return res.status(400).json({ error: "A question and a valid roadmap are required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

   const prompt = `
    You are "PathFinder," an intelligent AI learning mentor designed to guide users through personalized learning journeys. 
    Your goal is to provide clear, structured, and actionable guidance in a natural, conversational way while maintaining professional clarity.

    **CONTEXT:**
    - User's Roadmap Topic: "${roadmap.title}"
    - Full Learning Plan: ${JSON.stringify(roadmap.weeks)}
    - Conversation History: ${JSON.stringify(chatHistory)}
    - User's Latest Question: "${userQuestion}"

    **YOUR ROLE:**
    Based on the user's question and the context, deliver the next logical, focused step in their learning process. 
    Adapt your tone to be encouraging, supportive, and clear — like a real mentor helping a motivated learner.

    **GUIDELINES FOR YOUR RESPONSE:**
    1. **One Step at a Time:**  
      Always respond with the next meaningful step. Avoid overwhelming users — guide them gradually.
      - If the user says "next", "continue", "done", "ok", etc., move to the **next logical step**.  
      - If they ask a new question, start a **fresh step sequence** relevant to that topic.

    2. **Real-World Focus:**  
      Include practical context — mention tools, examples, or real scenarios where applicable.  
      Make the advice feel like something a developer or learner would do in real life.

    3. **Formatting for Clarity (Markdown Rules):**
      - Start every response directly with the step (e.g., **Step 1: Set Up Your Environment**)  
      - Use **bold** for key actions, terms, and concepts.  
      - Use *bullets* for subpoints or options.  
      - Use \`inline code\` for commands, filenames, or keywords.  
      - Use \`\`\`code blocks\`\`\` for larger code examples or configs.

    4. **Be Concise and Action-Oriented:**  
      Each step should be short, clear, and directly actionable. Avoid repeating context unless needed.

    5. **End with Engagement:**  
      Always end your response by prompting user interaction — e.g.,  
      “✅ Let me know when you’ve completed this step or if you’d like a deeper explanation.”

    6. **Stay Relevant:**  
      If the question is outside the user’s learning roadmap, politely redirect them:  
      “I can only guide you on topics related to your current learning roadmap.”

    Your responses should feel structured, yet adaptive — as if a knowledgeable mentor is guiding the learner through a real-world project or course.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Basic check for the special JSON response
    try {
      const parsed = JSON.parse(text);
      if (parsed.action === 'suggest_change') {
        return res.status(200).json({ response: parsed.suggestion });
      }
    } catch (e) {
      // Not a JSON response, so treat as plain text
    }

    res.status(200).json({ response: text });

  } catch (error) {
    console.error("Error in mentor chat:", error);
    res.status(500).json({ error: "Failed to get a response from the mentor." });
  }
};