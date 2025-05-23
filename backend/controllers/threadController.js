

const addThread = async (req, res) => {
    const { projectId, userId, content } = req.body;

    try {
        const project = await Project.findById(projectId);
        const user = await User.findById(userId);
        if (!project || !user) {
            return res.status(404).json({ message: 'Project or user not found' });
        }
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        // Check if the user is a member of the project
        const isMember = project.members.some(member => member.userId.toString() === userId);
        if (!isMember && project.owner_id.toString() !== userId) {
            return res.status(403).json({ message: 'User is not a member of this project' });
        }
        // Check if the user has permission to create threads
        // const hasPermission = project.members.some(member => member.userId.toString() === userId && member.role === 'admin');
        // if (!hasPermission) {
        //     return res.status(403).json({ message: 'User does not have permission to create threads' });
        // }
        const newThread = new Thread({
            projectId,
            userId,
            content,
        });
        await newThread.save();
        project.threads.push(newThread._id);
        await project.save();
        res.status(201).json(newThread);
    }
    catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const getThreads = async (req, res) => {
    const { projectId } = req.params;

    try {
        const threads = await Thread.find({ projectId }).populate('userId', 'username');
        res.status(200).json(threads);
    } catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}