import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/chat-app-assets/assets'
import {formatMessageTime} from "../lib/utils"

const ChatContainer = ({selectedUser, setSelectedUser}) => {
  
  const scrollEnd = useRef()

  useEffect(() => {
    if(scrollEnd.current) {
      scrollEnd.current.scrollIntoView({behaviour: "smooth"})
    }
  }, [])
  
  return selectedUser ? (
    <div className='h-full backdrop-blur-lg overflow-scroll relative'>
      <div className = 'flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src = {assets.profile_martin}
            alt = ""
            className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>Martin Johnson
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
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
        {messagesDummyData.map((msg, index) => (
          <div key={index}
              className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50e4f10f3cd28382ecf9' && 'flex-row-reverse'}`}>
                {msg.image ? (
                  <img src = {msg.image} alt = ""
                      className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                ) : (<p className = {`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white
                                      ${msg.senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`} >
                        {msg.text}
                    </p>
                )}
                <div className='text-center text-xs'>
                    <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon : assets.profile_martin} 
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
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-white text-sm placeholder-gray-400 outline-none p-3 border-none rounded-lg"
          />
          <input type = "file" id='image' accept='image/png, image/jpeg' hidden/>
          <label htmlFor='image'>
            <img src = {assets.gallery_icon} alt = "" className='w-5 mr-2 cursor-pointer'/>
          </label>
        </div>
        <img src = {assets.send_button}
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
