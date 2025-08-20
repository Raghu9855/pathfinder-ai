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
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
