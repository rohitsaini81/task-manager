import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    createdBy: { type: String, required: true },
    // username: {type: String,   required:true},
    taskId: { type: String, required: true },
    projectId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

}, { timestamps: true });

 const Comment = mongoose.model('task-manager-comments', commentSchema);
export default Comment;