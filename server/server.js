import express from "express"
import "dotenv/config"
import http from "http"
import cors from "cors"
import connectDB from "./db/index.js";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app)   //we are using this http server because socket.io suppport this http server

const port = process.env.PORT || 6000

//initialize socket.io server
export const socketio = new Server(server, {
    cors: {
        origin: "https://zany-dollop-wrr6pw76gx62v474-5173.app.github.dev", 
        methods: ["GET", "POST", "PUT", "PATCH"],
        credentials: true
    }})

//store online users
export const userSocketMap = {}   //{userId: socketId}

//socket io connection handler
socketio.on("connection", (socket) => {    //socket is the connection between client and server
    const userId = socket.handshake.query.userId
    console.log("Connection established with user", userId);

    if(userId) userSocketMap[userId] = socket.id

    //emit online users to all connected cients
    socketio.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log(`User with userId ${userId} disconnected`)
        delete userSocketMap[userId]
        socketio.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

//middlewares
app.use(express.json({limit: "4mb"}))   //all the request to this server will be passed using json method
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://zany-dollop-wrr6pw76gx62v474-5173.app.github.dev",
    credentials: true
}))    //will allow url to connect with backend
app.use("/api/status", (req, res) => {
    res.send("Server is live")
})

//connecting to MongoDB
connectDB()
.then(() => {
        server.on("error", (error) => {
            console.log("Error: ", error);
            throw error;
        })
        server.listen(port || 3000, () => {
            console.log(`Server is running at PORT: ${port}`);
        })
    })
    .catch((error) => { 
        console.log("MongoDB connection failed ", error)
    })
//routes import
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"

//routes declaration
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)