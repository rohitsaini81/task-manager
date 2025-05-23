import Project from '../models/Project.js';
import { verifyToken } from './authController.js';


const listProjects = async (req,res) => {
    // const { userId } = req.params;
    try {
        // const projects = await Project.find({ owner_id: userId });
        const projects = await Project.find();

        if (!projects) {
            return res.status(404).json({ message: 'No projects found' });
        }
        res.status(200).json({ projects });
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


const createProject = async (req, res) => {
    const { projectName, projectDescription, projectStatus} = req.body;
    const { userId } = req.params;

    if (!projectName || !projectDescription || !projectStatus ) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const newProject = await Project.create({
            owner_id: userId,
            projectName,
            projectDescription,
            projectStatus, 
            projectCreatedBy: userId,           
        });

        if (!newProject) {
            return res.status(400).json({ message: 'Project creation failed' });
        }

        return res.status(201).json({ message: 'Project created successfully', newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
const updateProject = async (req, res) => {
    const user = verifyToken(req, res);
    const { projectId } = req.params;
    const { projectName, projectDescription, projectStatus} = req.body;

    if (!projectName || !projectDescription || !projectStatus) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const updatedProject = await Project.findByIdAndUpdate({_id:projectId,owner_id:user.id}, {
            projectName,
            projectDescription,
            projectStatus,
      
        }, { new: true });

        if (!updatedProject) {
            return res.status(400).json({ message: 'Project update failed' });
        }

        return res.status(200).json({ message: 'Project updated successfully', updatedProject });
    } catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
const deleteProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
            return res.status(400).json({ message: 'Project deletion failed' });
        }

        return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
const getProjectById = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(400).json({ message: 'Project not found' });
        }

        // const threads = await Thread.find({ project
        //  TODO : return all threads related to this project in the response
        return res.status(200).json({ project });
    }
    catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}


export { listProjects, createProject, updateProject, deleteProject, getProjectById };