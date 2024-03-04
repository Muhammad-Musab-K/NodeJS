import mongoose from "mongoose"
import {DB} from "../constants.js"

const connectToDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB}`)
        console.log(`The db is: ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log.log(`The db connection is FAILED : ${error.message}`)
        process.exit(1)
    }
}

export { connectToDb }