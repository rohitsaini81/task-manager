import express from 'express';
import { register, login, verifyEndpoint } from '../controllers/authController.js';
import { resendOTP, verifyOTP } from '../controllers/otpController.js';
import { User } from '../models/User.js';
const router = express.Router();

router.post('/register', register);
router.get('/resend/otp', resendOTP);
router.post('/login', login);
router.post('/verify/otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
    if(!phone || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
    } 

    const result = await verifyOTP(phone, otp);
    if (result) {
        return res.json(result);
    }
    res.status(400).json({ message: 'Invalid OTP or expired' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/verify', verifyEndpoint)
export default router;
