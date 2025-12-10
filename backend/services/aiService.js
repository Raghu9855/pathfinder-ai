import { GoogleGenerativeAI } from '@google/generative-ai';
import { google } from 'googleapis';
import { configDotenv } from 'dotenv';
import { extractJSON } from '../utils/helpers.js';

configDotenv();

if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not set in environment variables!");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const customSearch = google.customsearch('v1');

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const validateTopic = async (topic) => {
    const validationPrompt = `Is the topic '${topic}' a technical skill, a scientific concept, an academic subject, or a professional field that can have a structured learning roadmap? Personal names, fictional characters, or general places are not valid topics for this purpose. Please answer with only the word "yes" or "no".`;
    const result = await model.generateContent(validationPrompt);
    const response = await result.response;
    const text = await response.text();
    return text.toLowerCase().trim().includes("yes");
};

export const generateRoadmapContent = async (topic, week) => {
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return extractJSON(text);
};

export const getMentorResponse = async (contextPrompt) => {
    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    return await response.text();
};

export const generateSearchQuery = async (concept, topic) => {
    const queryGenPrompt = `
    Generate ONE Google search query for learning ${concept} in ${topic}, for beginners.
    Include words like "tutorial", "for beginners", or "explained".
    Return ONLY the search query text, nothing else.
    `;
    const result = await model.generateContent(queryGenPrompt);
    return result?.response?.text ? (await result.response.text()).trim() : null;
};

export const searchGoogle = async (query) => {
    const response = await customSearch.cse.list({
        auth: process.env.GOOGLE_SEARCH_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        num: 3
    });
    return response?.data?.items || [];
};
