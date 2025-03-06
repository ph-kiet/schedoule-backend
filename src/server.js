import express from 'express';
import dotenv from 'dotenv'
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import rosterRoutes from './routes/rosterRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'
import businessOwnerRoutes from './routes/businessOwnerRoutes.js'
import cors from 'cors';

dotenv.config()
const app = express()

// MongoDB connection
dbConnect()

// Middleware
app.use(express.json())
app.use(cors())

//Api routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes)
apiRouter.use('/admin', adminRoutes)
apiRouter.use('/roster', rosterRoutes)
apiRouter.use('/employee', employeeRoutes)
apiRouter.use('/business-owner', businessOwnerRoutes)

app.use('/api', apiRouter)


app.listen(3005, () => console.log("Server is running on 3005"))