import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { sendOTP } from './otpController.js';
import dotenv from 'dotenv';
dotenv.config();



export const register = async (req, res) => {
  const { username, phone, password } = req.body;

  if (!username || !phone || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  console.log(phone)
  try {
    // Check if phone already registered
    const userExist = await User.findOne({phone: phone });
    if (userExist) return res.status(400).json({ message: 'phone number already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with isVerified default false
    const accountType = "admin"
    const newUser = await User.create({ username,accountType, phone, password: hashedPassword });

    if (!newUser) return res.status(400).json({ message: 'User registration failed' });



    // Send OTP
    // http://localhost:3000/api/verify/otp

    const result = await sendOTP(phone);
    if (result.error) {
      return res.status(500).json({ message: 'Failed to send OTP' });
    }

    res.status(201).json({ message: 'User created successfully. Please verify your phone number.' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};






export const login = async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const sessionId = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // update session id in database
    await User.findByIdAndUpdate(user._id, { sessionId: sessionId }, { new: true });
    

    // // 🔐 Set cookie
    // res.cookie('sessionId', sessionId, {
    //   httpOnly: true,             // Prevent JS access (secure against XSS)
    //   secure: process.env.NODE_ENV === 'production', // Send over HTTPS in prod
    //   sameSite: 'strict',         // Protect against CSRF
    //   maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // }).json({
    //   message: 'Login successful',
    //   user: { id: user._id, username: user.username, phone: user.phone }
    // });




    res.json({ sessionId, user: { id: user._id, username: user.username, phone: user.phone,Verified_status:user.isVerified } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const verifyEndpoint = async (req, res) => {
  try {
    const sessionId = req.headers.authorization?.split(' ')[1]; // Bearer token
    // const sessionId = req.cookies.sessionId; // use cookie-parser
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const decoded = jwt.verify(sessionId, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, sessionId: sessionId });
    if (!user) return res.status(401).json({ message: 'Invalid session or sessionId mismatch' });
    if (!user.isVerified) return res.status(401).json({ message: 'User not verified' });
    res.status(200).json({ message: 'Session is valid', user: { id: user._id,username: user.username, phone: user.phone,Verified_status:user.isVerified,Account_type:"Admin" } });
  } catch (err) {
    res.status(401).json({ message: 'sessionId is invalid or expired', error: err.message });
  }
};


export const verifyToken = (req, res) => {

  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}