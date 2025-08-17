import mongoose from "mongoose";

const roadmapSchema=new mongoose.Schema({
    topic:{
        type:String,
        required:true
    },
    roadmap:{
        type:Object,
        required:true
    }
}, {
    timestamps: true
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
