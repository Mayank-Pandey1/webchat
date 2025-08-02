import { User } from "../models/user.models.js";
import { Message } from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { socketio, userSocketMap } from "../server.js";

//get all Users except loggedin User
const getUsersForSidebar = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password -refreshToken")

    //count unseen messages for each user
    const unseenMessages = await Message.aggregate([
    {
      $match: {
        receiver: userId,
        seen: false,
      },
    },
    {
      $group: {
        _id: "$sender",
        count: { $sum: 1 },
      },
    },
  ]);

  //Convert to a lookup map { senderId: count }
  const unseenMap = unseenMessages.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.count;
    return acc;
  }, {});

  // Attach unseen count to each user
  const enrichedUsers = filteredUsers.map((user) => ({
    ...user.toObject(),
    unseenCount: unseenMap[user._id.toString()] || 0,
  }));

  return res.status(200)
            .json(new ApiResponse(200,  
              {
                users: enrichedUsers,
                unseenMessages: unseenMap
              }, "Users fetch success"))
})

//get all messages for selected user
const getAllMessages = asyncHandler(async (req, res) => {
    const {id: selectedUserId } = req.params;
    if(!selectedUserId) throw new ApiError(400, "Selected user not available")

    const myId = req.user._id

    const messages = await Message.find({
        $or: [ {sender: myId, receiver: selectedUserId},
               {sender: selectedUserId, receiver: myId}
         ]
    })


    await Message.updateMany({sender: selectedUserId, receiver: myId}, {seen: true})

    return res.status(200)
            .json(new ApiResponse(200, {messages}, "Messages fetch success"))
})

//mark message as seen
const seeMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if(!id) throw new ApiError(400, "Message id not found")

  const seenMessage = await Message.findByIdAndUpdate(id, 
                                {
                                  $set: {seen: true}
                                },
                                {new: true})
  
  if(!seenMessage) throw new ApiError(500, 'Error while updating message')

  return res.status(200).json(new ApiResponse(200, {seenMessage}, "Message seen success"))
                          
})

//send message to selected user
const sendMessageToSelectedUser = asyncHandler(async (req, res) => {
  const {text} = req.body
  const receiverId = req.params.id;
  const senderId = req.user._id;

  if(!receiverId) throw new ApiError(400, "Receiver id not found")
  
  let newMessage;
  if(req.file) {
    const imageLocalPath = req.file?.path
    if(!imageLocalPath) throw new ApiError(400, "Image not found")
    
    let imageUpload;
    if(imageLocalPath) {
      imageUpload = await uploadOnCloudinary(imageLocalPath)
      if(!imageUpload?.url) throw new ApiError("Error while uploading image message on cloudinary")
    }
    newMessage = await Message.create({sender: senderId, receiver: receiverId, text: imageUpload.url})

  } else if(text) {
      newMessage = await Message.create({sender: senderId, receiver: receiverId, text: text})
  }
  if(!newMessage) throw new ApiError(500, "New message not sent")
  
  //emit the new message to receiver's socket
  const receiverSocketId = userSocketMap[receiverId]

  if(receiverSocketId) { 
    socketio.to(receiverSocketId).emit("newMessage", newMessage)
  }

  return res.status(200).json(new ApiResponse(200, {newMessage}, "Message send success"))
})

export {getUsersForSidebar, getAllMessages, seeMessage, sendMessageToSelectedUser}