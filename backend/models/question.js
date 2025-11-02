import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    // Link to the user who asked
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The main topic, e.g., "python", "sql", "javascript"
    topic: {
      type: String,
      required: true,
      index: true, // Add an index for faster searching by topic
    },
    // The user's original, raw question
    originalQuestion: {
      type: String,
      required: true,
    },
    // The clean, AI-generated title
    title: {
      type: String,
      required: true,
    },
    // The AI-generated keywords
    tags: [
      {
        type: String,
      },
    ],
    // A list of all answers for this question
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
      },
    ],
    // A list of user IDs who have upvoted the *question* itself
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model('Question', questionSchema);
export default Question;