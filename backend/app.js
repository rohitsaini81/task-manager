import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';




dotenv.config();
const app = express();

connectDB();
import cookieParser from 'cookie-parser';
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running 🚀');
});
import developmentRoutes from './routes/developmentRoutes.js';
import project from './routes/projRoutes.js';
import task from './routes/taskRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/project',project)
app.use('/api/task',task)
app.use(developmentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));
