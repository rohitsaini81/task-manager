import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

import ip from "ip"


dotenv.config();
const app = express();

connectDB();
import cookieParser from 'cookie-parser';
app.use(cookieParser());
//app.use(cors());


app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.1.25:3000']
}));


app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running 🚀');
});
import developmentRoutes from './routes/developmentRoutes.js';
import project from './routes/projRoutes.js';
import task from './routes/taskRoutes.js';
import commRouter from './routes/commRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/project',project)
app.use('/api/task',task)
app.use('/api/comment', commRouter)
app.use(developmentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () =>{
   console.log(`Server running on port ${PORT} 🔥`)
  console.log(`Local:   http://${ip.address()}:${PORT}`);
 });
