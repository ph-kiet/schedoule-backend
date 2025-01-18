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

//Api routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes)
apiRouter.use('/users', userRoutes)

app.use('/api', apiRouter)


app.listen(3005, () => console.log("Server is running on 3005"))