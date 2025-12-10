import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import dotenv from 'dotenv';
import { elaborateQuestion } from '../services/aiService.js';
import { extractJSON } from '../utils/helpers.js';

dotenv.config();

/**
 * @desc    Create a new AI-moderated question
 * @route   POST /api/questions
 * @access  Private
 */
const createQuestion = async (req, res) => {
  const { originalQuestion, topic } = req.body;
  const userId = req.user._id;

  if (!originalQuestion || !topic) {
    return res.status(400).json({ message: 'Question and topic are required.' });
  }

  try {
    // 1. Call AI Service to pre-process the question
    // This now delegates to aiService.js which handles the SDK logic and fallbacks
    const aiResponse = await elaborateQuestion(originalQuestion, topic);

    // Fallbacks just in case elaborateQuestion somehow returns null (though it has its own fallback)
    const title = aiResponse?.title || originalQuestion.substring(0, 50);
    const tags = aiResponse?.tags || [topic];
    const aiAnswerText = aiResponse?.ai_answer || "I am unable to provide an AI answer at this time.";

    // 2. Create the new Question document
    const question = await Question.create({
      user: userId,
      topic: topic.toLowerCase(),
      originalQuestion,
      title: title,
      tags: tags,
    });


    // 3. Create the initial AI-generated Answer
    const aiAnswer = await Answer.create({
      text: aiAnswerText,
      question: question._id,
      user: userId, // Attribute the AI answer to the user who asked
      isAIGenerated: true,
    });

    // 4. Link the AI answer to the question
    question.answers.push(aiAnswer._id);
    await question.save();

    // 5. Populate user details for the new question
    const populatedQuestion = await Question.findById(question._id).populate(
      'user',
      'name'
    );

    res.status(201).json(populatedQuestion);

  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: 'Server error while creating question.' });
  }
};

/**
 * @desc    Get all questions, sorted by newest
 * @route   GET /api/questions
 * @access  Public
 */
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single question by ID, with all answers
 * @route   GET /api/questions/:id
 * @access  Public
 */
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'answers',
        populate: {
          path: 'user',
          select: 'name',
        },
      });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add a new (human) answer to a question
 * @route   POST /api/questions/:questionId/answers
 * @access  Private
 */
const addAnswer = async (req, res) => {
  const { text } = req.body;
  const { questionId } = req.params;
  const userId = req.user._id;

  if (!text) {
    return res.status(400).json({ message: 'Answer text is required.' });
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // 1. Create the new Answer
    const newAnswer = await Answer.create({
      text,
      question: questionId,
      user: userId,
      isAIGenerated: false, // This is a human answer
    });

    // 2. Link it to the Question
    question.answers.push(newAnswer._id);
    await question.save();

    // 3. Populate user data for the frontend
    const populatedAnswer = await Answer.findById(newAnswer._id).populate(
      'user',
      'name'
    );

    res.status(201).json(populatedAnswer);
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Upvote/downvote an answer
 * @route   POST /api/questions/answers/:answerId/upvote
 * @access  Private
 */
const upvoteAnswer = async (req, res) => {
  const { answerId } = req.params;
  const userId = req.user._id;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // --- THIS IS THE FIX ---
    // We must compare the string values of the ObjectIds
    const upvotedIndex = answer.upvotes.findIndex(id => id.toString() === userId.toString());

    if (upvotedIndex > -1) {
      // User has already upvoted, so remove them (toggle)
      answer.upvotes.splice(upvotedIndex, 1);
    } else {
      // User has not upvoted, so add them
      answer.upvotes.push(userId);
    }

    await answer.save();
    // Re-populate the user data for the answer to get the name
    const populatedAnswer = await Answer.findById(answerId).populate('user', 'name');
    res.status(200).json(populatedAnswer); // Send back the updated, populated answer
  } catch (error) {
    console.error("Error upvoting answer:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export all our new functions
export {
  createQuestion,
  getQuestions,
  getQuestionById,
  addAnswer,
  upvoteAnswer,
};