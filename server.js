require("dotenv").config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')


// MongoDB connection
const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` + `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`;
mongoose.connect(mongoUri)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log(`Connected to ${process.env.MONGO_DBNAME} database`))



  
app.listen(3005, () => console.log("Server is running on 3005"))