import { GoogleGenerativeAI } from '@google/generative-ai';
import Roadmap from '../models/roadmap.js';
import { configDotenv } from 'dotenv';

configDotenv(); // Load environment variables from .env file

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// --- API Route for Generating a Roadmap ---
export const generateRoadmap = async (req, res) => {
    const { topic } = req.body;

    // Basic validation to ensure a topic was provided
    if (!topic) {
        return res.status(400).json({ error: "The 'topic' field is required." });
    }

    try {
        // 1. Use the model that we confirmed is working from the test script.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // 2. Craft the prompt
        const prompt = `
          Create a detailed, 4-week learning roadmap for a beginner on the topic of '${topic}'.
          Your response MUST be a valid JSON object. Do not include any text or markdown formatting before or after the JSON.
          The JSON object should have a single key "roadmap" which is an object containing a "title" and a "weeks" array.
          Each object in the "weeks" array should have a "week" number, a "focus" string, and a "concepts" array of strings.

          Example format:
          {
            "roadmap": {
              "title": "4-Week Beginner's Roadmap to ${topic}",
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
        const response = await result.response;
        
        // 4. Extract the text from the response
        const text = response.text();
        const jsonData = JSON.parse(text);
        
        // This is a conceptual example
        await Roadmap.create({ topic: topic, roadmap: jsonData });

        // Send the structured JSON back to the client
        res.json(jsonData);

    } catch (error) {
        // Log the full error for debugging on the server
        console.error("Error generating roadmap:", error);
        // Send a generic error message to the client
        return res.status(500).json({ error: "Failed to generate roadmap" });
    }
};

