import mongoose from "mongoose"
import { MONGO_URI } from "../constants/env"


const connectDB = async ()=>{
    await mongoose.connect(MONGO_URI)
    .then(()=> console.log("db connected"))
    .catch(()=>{
        console.log(" db fails to connect")
        process.exit(1)
    })

}

export default connectDB