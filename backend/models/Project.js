import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  owner_id: { type: String, required: true },
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true },
    projectStatus: { type: String, required: true },
    projectStartDate: { type: Date, required: false },
    projectEndDate: { type: Date, required: false },
    projectMembers: { type: Array, required: false },
    projectSuperMembers:{ type: Array, required: false },
    projectFiles: { type: Array, required: false },
    projectCreatedAt: { type: Date, default: Date.now },
    projectUpdatedAt: { type: Date, default: Date.now },
    projectDeletedAt: { type: Date, default: null },
    projectCreatedBy: { type: String, required: true },
    projectUpdatedBy: { type: String, required: false },
    

}, { timestamps: true });

const Project = mongoose.model('task-manager-projects', projectSchema);
export default Project;