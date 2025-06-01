import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    createdBy:{ type: String, required: true },
    username: {type: String, required:true},
    members: { type: Array, required: false },
    SuperMembers: { type: Array, required: false },
    title: { type: String, required: true },
    projectId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    Files: { type: Array, required: false },
    createdAt: { type: Date, default: Date.now },

}, { timestamps: true });

 const Task = mongoose.model('task-manager-tasks', taskSchema);
export default Task;