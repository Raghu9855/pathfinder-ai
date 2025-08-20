import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import {generateRoadmap,getUserRoadmaps} from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/roadmap", protect, generateRoadmap);
router.get("/", protect, getUserRoadmaps); 

export default router;
