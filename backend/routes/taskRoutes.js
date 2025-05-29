import express from 'express';
import Project from '../models/Project.js';
import { User } from '../models/User.js';
import createTask, { deleteTask, getTasksByProjectId } from '../controllers/taskController.js';



const task=express.Router();
// Create a new task
task.post('/create', createTask);
task.get('/:projectId', getTasksByProjectId);
task.delete('/:taskId', deleteTask)

export default task;