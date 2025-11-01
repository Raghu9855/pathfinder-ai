import mongoose from "mongoose";

const roadmapSchema=new mongoose.Schema({
    topic:{
        type:String,
        required:true
    },
    roadmap:{
        type:Object,
        required:true
    },
    completedConcepts: {
        type: [String], // An array of concept strings
        default: []     // Default to an empty array
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    shareableId: {
      type: String,
      unique: true,
      sparse: true // This allows multiple documents to have no shareableId (null)
    }
}, {
    timestamps: true
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
