import mongoose from "mongoose"

const dbConnect = async () => {
    try{
        const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` + `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`;
        const connect = await mongoose.connect(mongoUri)
        console.log(`Database connected: ${connect.connection.name}`)
    } catch (err){
        console.log(error)
        process.exit(1)
    }   
    
}

export default dbConnect