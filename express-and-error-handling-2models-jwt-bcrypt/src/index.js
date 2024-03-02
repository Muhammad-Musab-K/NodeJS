import { connect_DB } from "./db/index.js";
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
    path: "./env"
})

connect_DB()
    .then(() => app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at ${process.env.PORT}`)
    }))
    .catch((error) => {
        console.log(`server is not responding :${error} `)
    })
