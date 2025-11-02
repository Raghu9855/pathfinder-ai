import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  addAnswer,
  upvoteAnswer,
} from '../controllers/questionController.js';

const router = express.Router();

// --- Public Routes ---
router.get('/', getQuestions);       // Get all questions
router.get('/:id', getQuestionById); // Get one question

// --- Private, Protected Routes ---
router.post('/', protect, createQuestion);             // Ask a new question
router.post('/:questionId/answers', protect, addAnswer); // Add a human answer
router.post('/answers/:answerId/upvote', protect, upvoteAnswer); // Upvote an answer

export default router;