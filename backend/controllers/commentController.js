import Task from "../models/Tasks.js";
import { verifyToken } from "../controllers/authController.js"; 
import Comment from "../models/Comments.js";
const createComment = async (req, res) => {
    try {
        const user = verifyToken(req, res);
        if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
        }
        
        const { taskId } = req.body;
        const { content } = req.body;
        const { projectId } = req.body;
        // Validate input
        if (!taskId || !content || !projectId) {
        return res.status(400).json({ error: "Task ID and content are required" });
        }
    
        // Check if task exists
        const task = await Task.findOne({ _id: taskId });
        if (!task) {
        return res.status(404).json({ error: "Task not found" });
        }
    
        // Create comment
        const commentObj = {
        content,
        taskId: task._id,
        projectId: task.projectId,
        createdBy: user.id,
        createdAt: new Date(),
        };

        const response= await Comment.create(commentObj)
       
        return res.status(201).json({ message: "Comment created successfully", response });
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
    }


const deleteComment = async (req, res) => {
    const { id } = req.params;
    const { projectId } = req.body;
    const { taskId } = req.body;
    // Validate input
    if (!id || !projectId || !taskId) {
        return res.status(400).send('ID, project ID, and task ID are required');
    }

    const task = await Task.findOne({ _id: taskId});
    // res.send(task)
    if (!task || task.projectId !== projectId) {
        return res.status(404).send('Task not found');
    }

    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
        return res.status(404).send('Comment not found');
    }
    res.status(200).send('Comment deleted successfully');
}



const getAllComments = async (req, res) => {
    const { taskId } = req.params;
    if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
    }

    try {
        const comments = await Comment.find({ taskId: taskId })
        return res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ error: "OOPS Internal server error" });
    }
}

export { deleteComment, getAllComments };

    export default createComment;