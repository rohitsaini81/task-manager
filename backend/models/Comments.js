import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
    userId:{ type: String, required: false },
    projectId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    // threadStartDate: { type: Date, required: true },
    // threadEndDate: { type: Date, required: false },
    threadMembers: { type: Array, required: false },

    threadFiles: { type: Array, required: false },
    // threadComments: { type: Array, required: false },
    createdAt: { type: Date, default: Date.now },
    // threadUpdatedAt: { type: Date, default: Date.now },
    // threadDeletedAt: { type: Date, default: null },
    // threadCreatedBy:{type:String},
    // threadUpdatedBy:{type:String}
}, { timestamps: true });

export const Thread = mongoose.model('task-manager-threads', threadSchema);
