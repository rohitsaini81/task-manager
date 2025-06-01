import express from 'express';

import { createProject, getProjectById, listProjects, updateProject } from '../controllers/projectController.js';
import { verifyToken } from '../controllers/authController.js';
import Project from '../models/Project.js';


const project = express.Router();
// Get all projects
project.get('/all/', listProjects);
project.post('/create', createProject);
project.put('/update/:projectId', updateProject);

// Get a project by ID
project.get('/find/:projectId', getProjectById);

project.delete('/delete/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const user = verifyToken(req, res);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!projectId) {
            return res.status(400).json({ message: 'Project ID is required' });
        }
        // Check if the project belongs to the user
        // Assuming you have a Project model with a findById method
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        if (project.owner_id.toString() !== user.id) {
            return res.status(403).json({ message: 'You do not have permission to delete this project' });
        }
        // Delete the project
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



export default project;