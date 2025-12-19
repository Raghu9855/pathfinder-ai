import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';
import { extractJSON } from '../utils/helpers.js';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

const customSearch = google.customsearch('v1');

export const validateTopic = async (topic) => {
    try {
        const validationPrompt = `Is the topic '${topic}' a technical skill, a scientific concept...`;
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: [validationPrompt]
        });

        return result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";
    } catch (error) {
        console.error("AI Service Validation Error:", error.message);
        return handleAIError(error);
    }
};

export const generateRoadmapContent = async (topic, week) => {
    const prompt = `
        Act as an expert curriculum designer. Create a detailed ${week}-week learning roadmap for a beginner on the topic of '${topic}'.
        
        If the topic '${topic}' is invalid (e.g. person name, place, non-technical concept), return {"error": "Invalid topic"}.

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

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        return extractJSON(text);
    } catch (error) {
        console.error("Error generating roadmap:", error.message);

        // Failover to mock data if quota exceeded or model issues
        if (isQuotaOrModelError(error)) {
            return generateMockRoadmap(topic, week);
        }
        return null;
    }
};

export const getMentorResponse = async (contextPrompt) => {
    try {
        const result = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: contextPrompt
        });
        return result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";
    } catch (error) {
        console.error("AI Service Chat Error:", error.message);
        return handleAIError(error);
    }
};

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
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        return extractJSON(text);
    } catch (error) {
        console.error("Error evaluating question:", error.message);
        return {
            title: originalQuestion.substring(0, 50) + "...",
            tags: [topic],
            ai_answer: "I am unable to generate a detailed answer right now, but I can help you find resources."
        };
    }
};

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
        const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || `${concept} ${topic}`;
        return rawText.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error("Error generating search query:", error.message);
        return `${concept} ${topic} tutorial beginner`;
    }
};

export const searchGoogle = async (query) => {
    try {
        if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
            console.error("Missing Google Search configuration");
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
        console.error("Google Search Error:", error.message);
        return [];
    }
};

// Start Helper Functions
const handleAIError = (error) => {
    if (isQuotaOrModelError(error)) {
        return "I'm currently overwhelmed with requests. Please wait a moment.";
    }
    return "I apologize, but I'm having trouble connecting to my AI services right now.";
};

const isQuotaOrModelError = (error) => {
    return error.message && (
        error.message.includes('429') ||
        error.message.includes('Quota') ||
        error.message.includes('404') ||
        error.message.includes('Not Found')
    );
};

const generateMockRoadmap = (topic, week) => {
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
};
