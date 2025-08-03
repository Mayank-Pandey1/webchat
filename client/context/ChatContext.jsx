import { useContext, useState, useEffect } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext()

export const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})  //we will store key value pair of {user: unseenMessages}

    const {axios, socket} = useContext(AuthContext)

    //function to get all users for sidebar
    const getUsers = async () => {
        try {
            const {data} = await axios.get("/api/messages/users")
            if(data.success) {
                setUsers(data.data.users)
                setUnseenMessages(data.data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to getMessgaes for selected user
    const getMessages = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`)
            if(data.success) {
                setMessages(data.data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send Message to selected user
    const sendMessage = async (messageData) => {
        try {
           const isFormData = messageData instanceof FormData;

           const config = {
            headers: isFormData
                ? { "Content-Type": "multipart/form-data" }
                : { "Content-Type": "application/json" },
            };

            const { data } = await axios.post(
            `/api/messages/send/${selectedUser._id}`,
            messageData,
            config
            );
            if(data.success) {
                setMessages((prevMessages) => [...prevMessages, data.data.newMessage])
            } else {
                toast.error(data.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to subscribe to messages for selected user : we will get updated Messages in real time
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.sender === selectedUser._id) {
                newMessage.seen = true
                setMessages((prevMessages) => [...prevMessages, newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.sender] : 
                            prevUnseenMessages[newMessage.sender] ? prevUnseenMessages[newMessage.sender] + 1 : 1
                }))
            }
        })
    }

    //function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket) socket.off("newMessage")
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    const value = {
            getUsers,
            getMessages,
            sendMessage,
            messages,
            users,
            selectedUser,
            setSelectedUser,
            unseenMessages,
            setUnseenMessages
    }

    return (<ChatContext.Provider value = {value}>
        {children}
    </ChatContext.Provider>)
}