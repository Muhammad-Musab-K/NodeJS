import { connectToDb } from "./db";
import { app } from "./app";
import dotenv from "dotenv"


dotenv.config({
    path: "./.env"
})

connectToDb()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("server is running at " + process.env.PORT)
        })
    }).catch(error => {
        console.log("server error" + error.message)
    })
