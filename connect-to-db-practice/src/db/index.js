import mongoose from "mongoose"
import { DB_NAME } from "../constant"

const connectToDb = async () => {
    try {
        const connectionDbIntance = await mongoose.connect(`${process.env.CONNECT_TO_DB}/${DB_NAME}`)
        console.log(`db is connect : ${connectionDbIntance.connection.host}`)
    } catch (error) {
        console.log(`Failed to connect due to ${error.message} `)
        process.exit(1)
    }
}

export { connectToDb }