import express from 'express';
import { User } from '../models/User.js';
const router = express.Router();


router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Development route is working' });
}
);

router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
);
router.get('/delete/:id', async(req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
}
);



export default router;