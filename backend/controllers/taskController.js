import Task from "../models/Tasks.js";
import Project from "../models/Project.js";
import { verifyToken } from "../controllers/authController.js"; // Assuming you have a utility function to verify JWT tokens
const createTask = async (req, res) => {
  try {
    const user = verifyToken(req, res);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { projectId, title, description, dueDate } = req.body;

    // Validate input
    if (!projectId || !title || !description || !dueDate) {
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
    // Create task logic here (e.g., save to database)
    const newTask = {
      createdBy,
      projectId,
      title,
      description,
      dueDate,
      id: Date.now(),
    }; // Mock task creation
    const createdTask = await Task.create(newTask);
    return res.status(201).json(createdTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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

    // Fetch tasks for the project
    const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default createTask;
export { getTasksByProjectId }; // Export both functions for use in routes
