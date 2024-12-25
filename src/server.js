const express = require('express')
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const app = express()

// MongoDB connection
dbConnect()

// Middleware
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.listen(3005, () => console.log("Server is running on 3005"))