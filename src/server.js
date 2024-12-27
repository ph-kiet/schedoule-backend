import express from 'express';
import dotenv from 'dotenv'
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config()
const app = express()

// MongoDB connection
dbConnect()

// Middleware
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.listen(3005, () => console.log("Server is running on 3005"))