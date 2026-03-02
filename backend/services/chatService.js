import ChatSession from '../models/ChatSession.js';
import Roadmap from '../models/Roadmap.js';
import * as aiService from './aiService.js';

export const getHistory = async (roadmapId, userId) => {
    const chatSession = await ChatSession.findOne({ roadmap: roadmapId, user: userId });
    return chatSession ? chatSession.messages : [];
};

export const postMessage = async (roadmapId, userId, userQuestion) => {
    const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId });
    if (!roadmap) throw new Error("Roadmap not found or unauthorized");

    let chatSession = await ChatSession.findOne({ roadmap: roadmapId, user: userId });
    if (!chatSession) {
        chatSession = await ChatSession.create({ user: userId, roadmap: roadmapId, messages: [] });
    }

    chatSession.messages.push({ sender: 'user', text: userQuestion });

    const prompt = `
    You are "PathFinder," an intelligent AI learning mentor.
    
    CONTEXT:
    - User's Roadmap Topic: "${roadmap.roadmap.title}"
    - Full Learning Plan: ${JSON.stringify(roadmap.roadmap.weeks)}
    - User's Progress (Completed Concepts): ${JSON.stringify(roadmap.completedConcepts || [])} 
    - Full Conversation History: ${JSON.stringify(chatSession.messages)}
    - User's Latest Question: "${userQuestion}"

    YOUR ROLE:
    Deliver the next logical, focused step to help the user learn.

    GUIDELINES:
    1. One step at a time.
    2. Real-world focus.
    3. Format with Markdown (Step 1: ..., **bold**, etc).
    4. Be concise and engaging.
    `;

    const aiText = await aiService.getMentorResponse(prompt);

    const aiMessage = { sender: 'ai', text: aiText };
    chatSession.messages.push(aiMessage);
    await chatSession.save();

    return aiMessage;
};
