import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    createdBy:{ type: String, required: false },
    projectId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    Files: { type: Array, required: false },
    createdAt: { type: Date, default: Date.now },

}, { timestamps: true });

export const Thread = mongoose.model('task-manager-tasks', taskSchema);
