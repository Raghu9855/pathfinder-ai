import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {generateRoadmap,getUserRoadmaps,deleteRoadmap,chatWithMentor} from "../controllers/roadmapController.js";


const router = express.Router();

router.post("/roadmap", protect, generateRoadmap);
router.get("/roadmaps", protect, getUserRoadmaps);
router.delete('/roadmaps/:id', protect, deleteRoadmap);
router.post('/chat/mentor', protect, chatWithMentor);

export default router;
