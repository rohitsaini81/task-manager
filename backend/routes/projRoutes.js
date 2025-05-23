import express from 'express';

import { createProject, getProjectById, listProjects, updateProject } from '../controllers/projectController.js';


const project = express.Router();
// Get all projects
project.get('/all/', listProjects);
project.post('/create/:userId', createProject);
project.put('/update/:projectId', updateProject);

// Get a project by ID
project.get('/find/:projectId', getProjectById);





export default project;