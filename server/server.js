import express from "express"
import "dotenv/config"
import http from "http"
import cors from "cors"
import connectDB from "./db/index.js";

const app = express();
const server = http.createServer(app)   //we are using this http server because socket.io suppport this http server

const port = process.env.PORT || 6000

//middlewares
app.use(express.json({limit: "4mb"}))   //all the request to this server will be passed using json method
app.use(cors())    //will allow all url to connect with backend
app.use("/api/status", (req, res) => {
    res.send("Server is live")
})

//connecting to MongoDB
await connectDB()


server.listen(port, () => {
    console.log("Server is listening/running on port: ", port)
})