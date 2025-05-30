import Task from "../models/Tasks.js";
import Project from "../models/Project.js";
import { verifyToken } from "../controllers/authController.js"; // Assuming you have a utility function to verify JWT tokens
const createTask = async (req, res) => {
  try {
    const user = verifyToken(req, res);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { projectId, title, content, dueDate } = req.body;

    // Validate input
    if (!projectId || !title || !content || !dueDate) {
      return res.status(400).json({ error: "All fields are required" });
    }
  

    // Check if project exists and belongs to the user
    const project = await Project.findOne({ _id: projectId });
    if (
      !project ||
      (project.owner_id !== user.id &&
        !project.projectMembers.includes(user.id))
    ) {
      return res
        .status(404)
        .json({ error: "Project not found or unauthorized" });
    }
    const createdBy = user.id;
    // const username = user.username;
    // Create task logic here (e.g., save to database)
    const newTask = {
      createdBy,
      projectId,
      title,
      content,
      dueDate,
      type: "task", 
    }; 
    const createdTask = await Task.create(newTask);
    return res.status(201).json(createdTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const deleteTask = async (req, res) => {
  try {

    const project = req.body;
    console.log("Project data:", project);
    if (!project.projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }
    const user = verifyToken(req, res);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { taskId } = req.params;

    // Validate input
    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
    }


    const test = await Project.findOne({ _id: project.projectId });
    if (
      !test ||
      (test.owner_id !== user.id && !test.projectMembers.includes(user.id))
    ) {
      return res.status(404).json({ error: "Project not found or unauthorized" });
    }


    // Check if task exists and belongs to the user
    const task = await Task.findOne({ _id: taskId });
    if (!task || task.createdBy !== user.id) {
      return res.status(404).json({ error: "Task not found or unauthorized" });
    }

    // Delete the task
    await Task.deleteOne({ _id: taskId });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}



const getTasksByProjectId = async (req, res) => {
  try {
    const user = verifyToken(req, res);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { projectId } = req.params;

    // Validate input
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    // Check if project exists and belongs to the user
    const project = await Project.findOne({ _id: projectId });
    if (
      !project ||
      (project.owner_id !== user.id &&
        !project.projectMembers.includes(user.id))
    ) {
      return res
        .status(404)
        .json({ error: "Project not found or unauthorized" });
    }
console.log("Fetching tasks for project:", projectId);
    // Fetch tasks for the project
    const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default createTask;
export { getTasksByProjectId, deleteTask }; // Export both functions for use in routes
