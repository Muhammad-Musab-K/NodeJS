import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


export const connect_DB = async () => {
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`the DB is connected to : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`the db connection is FAILED:${error.message}`)
        process.exit(1)
    }
}


