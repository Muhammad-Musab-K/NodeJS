import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({ origin: process.env.CORS_URL, credentials: true }));
app.use(express.json({ limit: "16kb" }));//agr ye nh likhun mongodb me undefined show hoga
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

export { app }

