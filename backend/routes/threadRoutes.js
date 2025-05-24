import express from 'express';
import Project from '../models/Project.js';
import { User } from '../models/User.js';
import { Thread } from '../models/Comments.js';



const thread=express.Router();

thread.post('/create/:projectId', async (req, res) => {
    const { projectId } = req.params;
    // Validate projectId
    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
    }
    // Validate request body
    if (!req.body || !req.body.userId || !req.body.content || !req.body.type || !req.body.title) {
        return res.status(400).json({ message: 'User ID, content, and type are required' });
    }
    const {  userId, content, type, title } = req.body;

    try {
        const project = await Project.findById(projectId);
        const user = await User.findById(userId);
        if (!project || !user) {
            return res.status(404).json({ message: 'Project or user not found' });
        }
        const newThread =await Thread.create({
            projectId,
            userId,
            content,
            type,
            title,
            createdAt: new Date(),
        });
        project.projectThreads.push(newThread._id);
        await project.save();
        res.status(201).json(newThread);
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
);



export default thread;