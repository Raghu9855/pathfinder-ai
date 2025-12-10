import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';
import { extractJSON } from '../utils/helpers.js';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not set in environment variables!");
}

// ---- Gemini client (New SDK) ----
// Correct initialization with object argument
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.0-flash-lite";

// ---- Google Custom Search client ----
const customSearch = google.customsearch('v1');


// -----------------------------------------------------------------------------
// 1. Topic Validation
// -----------------------------------------------------------------------------
export const validateTopic = async (topic) => {
    try {
        const validationPrompt = `Is the topic '${topic}' a technical skill, a scientific concept...`;
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: [validationPrompt]
        });
        const text = result.text ? result.text() : "I'm having trouble thinking right now.";

        console.log("DEBUG: Raw Gemini Chat Response:", text);
        return text;
    } catch (error) {
        console.error("AI Service Chat Error detailed:", error.message);

        if (error.message && (error.message.includes('429') || error.message.includes('Quota'))) {
            return "I'm currently overwhelmed with requests (Quota Exceeded). please wait a moment.";
        }
        if (error.message && (error.message.includes('404') || error.message.includes('Not Found'))) {
            return "My AI service is currently unavailable (Model Not Found).";
        }

        return "I apologize, but I'm having trouble connecting to my AI services right now.";
    }
};


// -----------------------------------------------------------------------------
// 2. Generate Roadmap Content (JSON Mode)
// -----------------------------------------------------------------------------
export const generateRoadmapContent = async (topic, week) => {
    const prompt = `
        Act as an expert curriculum designer. create a detailed ${week}-week learning roadmap for a beginner on the topic of '${topic}'.
        
        IMPORTANT: If the topic '${topic}' is invalid (e.g. person name, place, non-technical concept), return {"error": "Invalid topic"}.

        Structure the output as a JSON object with this EXACT schema:
        {
          "roadmap": {
            "title": "Start Your Journey in ${topic}",
            "weeks": [
              {
                "week": 1,
                "focus": "Fundamental Concepts & Setup",
                "concepts": [
                  "Specific Concept 1 (e.g. Variables)",
                  "Specific Concept 2 (e.g. Loops)",
                  "Hands-on Practice Task"
                ]
              }
            ]
          }
        }

        Requirements:
        1. "weeks" array MUST have exactly ${week} items.
        2. "focus" should be a short, action-oriented theme for the week.
        3. "concepts" should be specific, granular topics, not generic headers.
        4. The difficulty should progress naturally from basic to intermediate.
    `.trim();

    try {
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            },
        });

        const text = result.text ? result.text() : "{}";
        console.log("DEBUG: Raw JSON Roadmap Response:", text);
        return extractJSON(text);
    } catch (error) {
        console.error("Error generating roadmap content:", error.message);

        // Fallback to MOCK data if Quota Exceeded OR Model 404
        if (error.message && (
            error.message.includes('429') ||
            error.message.includes('Quota') ||
            error.message.includes('404') ||
            error.message.includes('Not Found')
        )) {
            console.log("⚠️ AI SERVICE ERROR (Quota/404): Generating MOCK roadmap data to prevent app failure.");
            return {
                roadmap: {
                    title: `[MOCK] Learning Path: ${topic}`,
                    weeks: Array.from({ length: week }, (_, i) => ({
                        week: i + 1,
                        focus: `Core Concepts of ${topic} (Week ${i + 1})`,
                        concepts: [
                            `Introduction to ${topic} Part ${i + 1}`,
                            "Key Principles and Syntax",
                            "Practical Exercises and Documentation",
                        ],
                    })),
                },
            };
        }

        return null;
    }
};


// -----------------------------------------------------------------------------
// 3. Chat Mentor Response (Robust)
// -----------------------------------------------------------------------------
export const getMentorResponse = async (contextPrompt) => {
    try {
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: contextPrompt
        });
        const text = result.text ? result.text() : "I'm having trouble thinking right now.";

        console.log("DEBUG: Raw Gemini Chat Response:", text);
        return text;
    } catch (error) {
        console.error("AI Service Chat Error detailed:", error.message);

        if (error.message && (error.message.includes('429') || error.message.includes('Quota'))) {
            return "I'm currently overwhelmed with requests (Quota Exceeded). please wait a moment.";
        }
        if (error.message && (error.message.includes('404') || error.message.includes('Not Found'))) {
            return "My AI service is currently unavailable (Model Not Found).";
        }

        return "I apologize, but I'm having trouble connecting to my AI services right now.";
    }
};

// -----------------------------------------------------------------------------
// 4. Elaborate Question (For Question Controller)
// -----------------------------------------------------------------------------
export const elaborateQuestion = async (originalQuestion, topic) => {
    const prompt = `
      You are an expert technical editor. A user has submitted the following question about "${topic}":
      "${originalQuestion}"
      
      1. Suggest a clean, concise title for this question.
      2. Identify 3-5 relevant keywords or tags.
      3. Provide a basic, helpful, AI-generated answer to get the conversation started.

      Respond with a JSON object containing keys: "title", "tags", "ai_answer".
    `;

    try {
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const text = result.text ? result.text() : "{}";
        return extractJSON(text);
    } catch (error) {
        console.error("Error elaborateQuestion:", error.message);
        // Robust Fallback
        return {
            title: originalQuestion.substring(0, 50) + "...",
            tags: [topic],
            ai_answer: "I am unable to generate a detailed answer right now, but I can help you find resources."
        };
    }
};


// -----------------------------------------------------------------------------
// 5. Generate Search Query for Google
// -----------------------------------------------------------------------------
export const generateSearchQuery = async (concept, topic) => {
    const queryGenPrompt = `
    Generate ONE Google search query for learning "${concept}" in the context of "${topic}".
    Return ONLY the search query text.
    `.trim();

    try {
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: queryGenPrompt
        });
        const text = result.text ? result.text().trim().replace(/^"|"$/g, '') : `${concept} ${topic}`;

        console.log(`DEBUG: Generated Search Query: [${text}]`);
        return text;
    } catch (error) {
        console.error("Error generating search query:", error.message);
        return `${concept} ${topic} tutorial beginner`;
    }
};


// -----------------------------------------------------------------------------
// 6. Google Custom Search
// -----------------------------------------------------------------------------
export const searchGoogle = async (query) => {
    try {
        console.log(`DEBUG: Executing Google Search with query: [${query}]`);

        if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
            console.error("MISSING GOOGLE SEARCH KEYS");
            return [];
        }

        const response = await customSearch.cse.list({
            auth: process.env.GOOGLE_SEARCH_API_KEY,
            cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
            q: query,
            num: 3,
        });

        return response?.data?.items || [];
    } catch (error) {
        console.error("Error performing Google Search:", error.message);
        return [];
    }
};
