import mongoose from "mongoose";

// Define the structure for a single message
const messageSchema = new mongoose.Schema({
  sender: {
    type: String, // Will be 'user' or 'ai'
    required: true,
  },
  text: {
    type: String,
    required: true,
  }
});

const chatSessionSchema = new mongoose.Schema({
  // Link to the user who owns this chat
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // Link to the specific roadmap this chat is about
  roadmap: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Roadmap'
  },
  // An array of all messages in this session
  messages: [messageSchema]
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;