import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_URL,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
app.use(express.static("public"))
//static isme jese pdf files ya images hm apne public k folder me kch manually store krenge isse
app.use(cookieParser())

export { app }

//import Routes 
import userRouter from "./routes/user.route.js"

app.use("/api/v1/users", userRouter)