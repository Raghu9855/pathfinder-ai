import express from "express";
import { protect } from "../middleware/authMiddleware.js";

// This import is now correct and includes all functions
import {
  generateRoadmap,
  getUserRoadmaps,
  deleteRoadmap,
  chatWithMentor,
  updateProgress,
  getChatSession,
  postToChatSession,
  getLeaderboard,
  createShareableLink,
  getSharedRoadmap,
  findResources
} from "../controllers/roadmapController.js";

const router = express.Router();

// --- PROTECTED ROUTES (require login) ---
router.post("/roadmap", protect, generateRoadmap);
router.get("/roadmaps", protect, getUserRoadmaps);
router.delete('/roadmaps/:id', protect, deleteRoadmap);
router.post('/roadmaps/:id/progress', protect, updateProgress);
router.post('/roadmap/:id/share', protect, createShareableLink);
router.post('/chat/mentor', protect, chatWithMentor);
router.get('/chat/:roadmapId', protect, getChatSession);
router.post('/chat/:roadmapId', protect, postToChatSession);
router.post('/roadmap/resources', protect, findResources);

// --- PUBLIC ROUTES (no login needed) ---
router.get("/leaderboard", getLeaderboard); // "protect" has been removed here
router.get("/roadmap/share/:shareableId", getSharedRoadmap);

export default router;