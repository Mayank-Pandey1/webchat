import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/chat-app-assets/assets'
import {formatMessageTime} from "../lib/utils"
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {

  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext)
  const {authUser, onlineUsers} = useContext(AuthContext)

  const scrollEnd = useRef()

  const [input, setInput] = useState('')

  //handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(input.trim() === "") return null

    await sendMessage({text: input.trim()});
    setInput("")
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")) {
      toast.error('Select an image file')
      return;
    }
    const formData = new FormData();
    formData.append("image", file); // IMPORTANT: field name must be "image" to match multer.single("image")

    try {
      await sendMessage(formData); // This function will call axios.post with FormData
      e.target.value = ""; // clear input
    } catch (err) {
      toast.error("Failed to send image");
      console.error(err);
    }
  }

  useEffect(() => {
    if(selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  useEffect(() => {
    if(scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({behaviour: "smooth"})
    }
  }, [messages])
  
  return selectedUser ? (
    <div className='h-full backdrop-blur-lg overflow-scroll relative'>
      <div className = 'flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src = {selectedUser.profilePic || assets.avatar_icon}
            alt = ""
            className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
          <span className='w-2 h-2 rounded-full bg-green-500'></span>)}
        </p>
        <img src = {assets.arrow_icon}
              alt = ""
              onClick={() => setSelectedUser(null)}
              className='max-w-7 md:hidden' />  
        <img src = {assets.help_icon} 
            alt=""
            className='max-w-5 max-md:hidden'/>
      </div>

      {/* chat area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index) => (
          <div key={index}
              className={`flex items-end gap-2 justify-end ${msg.sender !== authUser._id  && 'flex-row-reverse'}`}>
                {msg.text.startsWith("http://res.cloudinary.com") ? (
                  <img src = {msg.text} 
                      alt = ""
                      className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"/>
                ) : (<p className = {`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white
                                      ${msg.sender === authUser._id  ? 'rounded-br-none' : 'rounded-bl-none'}`} >
                        {msg.text}
                    </p>
                )}
                <div className='text-center text-xs'>
                    <img src={msg.sender === authUser._id  ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} 
                        className='w-7 rounded-full'/>
                    <p className='text-gray-500'> {formatMessageTime(msg.createdAt)} </p>
                </div>
          </div>
        ))}
        <div ref = {scrollEnd}></div>
      </div>

      {/* bottom area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className='flex-1 bg-gray-100/12 flex items-center px-3 rounded-full'>
          {/* Text input */}
          <input onChange={(e) => setInput(e.target.value)} value = {input}
            onKeyDown={(e) => e.key ==="Enter" ? handleSendMessage(e) : null}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-white text-sm placeholder-gray-400 outline-none p-3 border-none rounded-lg"
          />
          <input onChange={handleSendImage} type = "file" id='image' accept='image/png, image/jpeg' hidden/>
          <label htmlFor='image'>
            <img src = {assets.gallery_icon} alt = "" className='w-5 mr-2 cursor-pointer'/>
          </label>
        </div>
        <img src = {assets.send_button}
            onClick={handleSendMessage}
            className='w-7 cursor-pointer'/>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center text-gray-500 bg-white/10 gap-2 max-md:hidden'>
      <img src = {assets.logo_icon}
          alt = ""
          className='max-w-16' />
      <div className='text-lg font-medium text-white'>Chat anytime, anywhere</div>
    </div>
  )
}

export default ChatContainer
