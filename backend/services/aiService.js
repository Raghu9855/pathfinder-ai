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
    console.log("DEBUG: Raw Gemini Validation Response:", text); // Debug log
    return text.toLowerCase().trim().includes("yes");
};

// 1. Generate Roadmap Content (JSON Mode)
export const generateRoadmapContent = async (topic, week) => {
    // specific model instance for JSON mode
    const jsonModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
        Create a detailed, ${week}-week learning roadmap for a beginner on the topic of '${topic}'.
        
        IMPORTANT: If the topic '${topic}' is a person's name, a place, or a concept for which a technical or academic learning roadmap is not possible, return a JSON with key "error" and value "Invalid topic".

        The JSON object should have a single key "roadmap" containing "title" and "weeks".
        The "weeks" array MUST contain exactly ${week} object(s).
        Each object in "weeks" should have: "week" (number), "focus" (string), "concepts" (array of strings).
        `;

    try {
        const result = await jsonModel.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        console.log("DEBUG: Raw JSON Roadmap Response:", text);
        return JSON.parse(text); // No need for extractJSON if using JSON mode, but parsing validation is good
    } catch (error) {
        console.error("Error generating roadmap content:", error);
        return null;
    }
};

// 2. Chat Mentor Response (Robust)
export const getMentorResponse = async (contextPrompt) => {
    try {
        const result = await model.generateContent(contextPrompt);
        const response = await result.response;
        console.log("DEBUG: Raw Gemini Chat Response:", await response.text());
        return await response.text();
    } catch (error) {
        console.error("AI Service Chat Error:", error);
        return "I apologize, but I'm having trouble connecting to my AI services right now. Please try again in a moment.";
    }
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
