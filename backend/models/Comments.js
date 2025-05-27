import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
    userId:{ type: String, required: false },
    projectId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    threadMembers: { type: Array, required: false },
    threadFiles: { type: Array, required: false },
    createdAt: { type: Date, default: Date.now },

}, { timestamps: true });

export const Thread = mongoose.model('task-manager-comments', threadSchema);
