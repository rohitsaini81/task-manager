import express from 'express';
import createComment, { deleteComment, getAllComments } from '../controllers/commentController.js';
import Task from '../models/Tasks.js';

const commRouter = express.Router();


commRouter.post('/create', createComment);



commRouter.delete('/delete/:id', deleteComment);


commRouter.get('/all/:taskId',getAllComments);


export default commRouter