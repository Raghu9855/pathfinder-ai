import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    // Link to the question this answer belongs to
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Question',
    },
    // Link to the user who wrote this answer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // We'll use this to flag the first AI-generated answer
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    // A list of user IDs who have upvoted this answer
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

const Answer = mongoose.model('Answer', answerSchema);
export default Answer;