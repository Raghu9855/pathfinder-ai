import * as roadmapService from '../services/roadmapService.js';
import * as chatService from '../services/chatService.js';
import * as aiService from '../services/aiService.js';

export const generateRoadmap = async (req, res) => {
  try {
    const { topic, week } = req.body;
    if (!topic || (week <= 0 || week > 52)) {
      return res.status(400).json({ error: "Invalid topic or week." });
    }

    const newRoadmap = await roadmapService.createRoadmap(req.user._id, topic, week);
    res.status(201).json(newRoadmap);
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: error.message || "Failed to generate roadmap" });
  }
};

export const getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await roadmapService.getUserRoadmaps(req.user._id);
    res.status(200).json(roadmaps);
  } catch (error) {
    console.error("Error fetching roadmaps:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteRoadmap = async (req, res) => {
  try {
    await roadmapService.deleteRoadmap(req.params.id, req.user._id);
    res.status(200).json({ message: 'Roadmap deleted successfully', id: req.params.id });
  } catch (error) {
    if (error.message === "Not authorized") return res.status(401).json({ message: error.message });
    if (error.message === "Roadmap not found") return res.status(404).json({ message: error.message });
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { concept, completed } = req.body;
    const roadmap = await roadmapService.updateProgress(req.params.id, req.user._id, concept, completed);
    res.status(200).json(roadmap);
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getChatSession = async (req, res) => {
  try {
    const messages = await chatService.getHistory(req.params.roadmapId, req.user._id);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const postToChatSession = async (req, res) => {
  try {
    const { userQuestion } = req.body;
    if (!userQuestion) return res.status(400).json({ error: "Question required" });

    const aiMessage = await chatService.postMessage(req.params.roadmapId, req.user._id, userQuestion);
    res.status(200).json(aiMessage);
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Failed to get response" });
  }
};

export const chatWithMentor = async (req, res) => {
  // Legacy route - prefer postToChatSession
  res.status(404).json({ message: "Please use the chat session endpoint." });
};

export const createShareableLink = async (req, res) => {
  try {
    const id = await roadmapService.createShareableLink(req.params.id, req.user._id);
    res.status(200).json({ shareableId: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSharedRoadmap = async (req, res) => {
  try {
    const data = await roadmapService.getSharedRoadmap(req.params.shareableId);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await roadmapService.getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const findResources = async (req, res) => {
  try {
    const { concept, topic } = req.body;
    if (!concept || !topic) return res.status(400).json({ error: "Concept and topic required" });

    const query = await aiService.generateSearchQuery(concept, topic);
    if (!query) return res.status(404).json({ message: "Could not generate search query" });

    const items = await aiService.searchGoogle(query);
    if (items.length === 0) return res.status(404).json({ message: "No resources found" });

    const resources = items.map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet
    }));

    res.status(200).json(resources);
  } catch (error) {
    console.error("Error funding resources:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
