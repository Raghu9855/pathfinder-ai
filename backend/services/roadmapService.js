import Roadmap from '../models/Roadmap.js';
import * as aiService from './aiService.js';

export const createRoadmap = async (userId, topic, week) => {
    const isValid = await aiService.validateTopic(topic);
    if (!isValid) {
        throw new Error("The provided topic is not valid for a structured learning roadmap.");
    }

    const jsonData = await aiService.generateRoadmapContent(topic, week);
    if (!jsonData || !jsonData.roadmap) {
        throw new Error("Failed to generate valid roadmap content.");
    }

    const newRoadmap = await Roadmap.create({
        user: userId,
        topic: topic,
        roadmap: jsonData.roadmap
    });

    return newRoadmap;
};

export const getUserRoadmaps = async (userId) => {
    return await Roadmap.find({ user: userId }).sort({ createdAt: -1 });
};

export const deleteRoadmap = async (roadmapId, userId) => {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
        throw new Error("Roadmap not found");
    }
    if (roadmap.user.toString() !== userId.toString()) {
        throw new Error("Not authorized");
    }
    await roadmap.deleteOne();
    return roadmapId;
};

export const getRoadmapById = async (roadmapId) => {
    return await Roadmap.findById(roadmapId);
};

export const updateProgress = async (roadmapId, userId, concept, completed) => {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) throw new Error("Roadmap not found");
    if (roadmap.user.toString() !== userId.toString()) throw new Error("Not authorized");

    const completedSet = new Set(roadmap.completedConcepts);
    if (completed) completedSet.add(concept);
    else completedSet.delete(concept);

    roadmap.completedConcepts = Array.from(completedSet);
    await roadmap.save();
    return roadmap;
};

export const getLeaderboard = async () => {
    return await Roadmap.aggregate([
        {
            $project: {
                user: 1,
                totalCompleted: { $size: { $ifNull: ["$completedConcepts", []] } }
            }
        },
        {
            $group: {
                _id: "$user",
                totalScore: { $sum: "$totalCompleted" }
            }
        },
        { $sort: { totalScore: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $unwind: "$userDetails" },
        {
            $project: {
                _id: 0,
                name: "$userDetails.name",
                score: "$totalScore"
            }
        }
    ]);
};

export const createShareableLink = async (roadmapId, userId) => {
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) throw new Error("Roadmap not found");
    if (roadmap.user.toString() !== userId.toString()) throw new Error("Not authorized");

    if (roadmap.isPublic && roadmap.shareableId) {
        return roadmap.shareableId;
    }

    const { nanoid } = await import('nanoid');
    roadmap.shareableId = nanoid(10);
    roadmap.isPublic = true;
    await roadmap.save();
    return roadmap.shareableId;
};

export const getSharedRoadmap = async (shareableId) => {
    const roadmap = await Roadmap.findOne({ shareableId, isPublic: true });
    if (!roadmap) throw new Error("Shared roadmap not found");
    return {
        topic: roadmap.topic,
        roadmap: roadmap.roadmap,
        createdAt: roadmap.createdAt
    };
};
