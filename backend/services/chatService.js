import ChatSession from '../models/ChatSession.js';
import Roadmap from '../models/Roadmap.js';
import * as aiService from './aiService.js';

export const getHistory = async (roadmapId, userId) => {
    const chatSession = await ChatSession.findOne({ roadmap: roadmapId, user: userId });
    return chatSession ? chatSession.messages : [];
};

export const postMessage = async (roadmapId, userId, userQuestion) => {
    // 1. Get Context
    const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
    if (!roadmap) throw new Error("Roadmap not found or unauthorized");

    // 2. Find/Create Session
    let chatSession = await ChatSession.findOne({ roadmap: roadmapId, user: userId });
    if (!chatSession) {
        chatSession = await ChatSession.create({ user: userId, roadmap: roadmapId, messages: [] });
    }

    // 3. Add User Message
    chatSession.messages.push({ sender: 'user', text: userQuestion });

    // 4. Build Prompt
    const prompt = `
    You are "PathFinder," an intelligent AI learning mentor...
    CONTEXT:
    - User's Roadmap Topic: "${roadmap.roadmap.title}"
    - Full Learning Plan: ${JSON.stringify(roadmap.roadmap.weeks)}
    - User's Progress (Completed Concepts): ${JSON.stringify(roadmap.completedConcepts || [])} 
    - Full Conversation History: ${JSON.stringify(chatSession.messages)}
    - User's Latest Question: "${userQuestion}"

    YOUR ROLE:
    Deliever the next logical, focused step.

    GUIDELINES:
    1. One Step at a Time.
    2. Real-World Focus.
    3. Format with Markdown (Step 1: ..., **bold**, etc).
    4. Be Concise.
    5. End with Engagement.
    6. Stay Relevant.
    `;

    // 5. Get AI Response
    const aiText = await aiService.getMentorResponse(prompt);

    // 6. Add AI Message & Save
    const aiMessage = { sender: 'ai', text: aiText };
    chatSession.messages.push(aiMessage);
    await chatSession.save();

    return aiMessage;
};
