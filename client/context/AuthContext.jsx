//Here we add all state variables and functions related to authentication 

//this file is used to manage and share authentication-related state and 
// logic (like axios, user login state, tokens, etc.) globally across your 
// app, without prop drilling.

import { createContext, useState, useEffect, useRef } from "react";    //createContext: Used to create a new context (AuthContext) for sharing global state (like user info, socket, etc.).  
import axios from "axios"   //http client to communicate with backend
import { toast } from "react-hot-toast"
import { io } from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl
axios.defaults.withCredentials = true

//Create a context using createContext hook
export const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    //const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null);   //current logged-in user
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null)
    const socketRef = useRef(null);   //persitent across re-renders

    //check if user is autheticated and if so, set the user data and connect the socket
    const connectSocket = (userId) => {
      if (socketRef.current) socketRef.current.disconnect();

      const newSocket = io(backendUrl, {
        query: { userId },
        withCredentials: true,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds) => {
        setOnlineUsers(userIds);
      });
    };

    const checkAuthStatus = async () => {
      try {
        const { data } = await axios.get("/api/auth/check");

        if (data.success) {
          setAuthUser(data.data);
          connectSocket(data.data._id);
        }
      } catch (err) {
        setAuthUser(null);
        setSocket(null);
        console.error("Not authenticated:", err?.response?.data?.message || err.message);
        toast.error(err?.response?.data?.message || "Login first");
      }
    };


    //login function to handle user authentication and socket conection
    //it will handle both register and login based upon the state
    const login = async (state, credentials) => {    //credentials contains form-data
      try {
        const {data} = await axios.post(`/api/auth/${state}`, credentials)
        if(data.success) {
          setAuthUser(data.data.user)
          connectSocket(data.data.user._id)
          toast.success("Login successful")
        } else {
            toast.error("Login failed");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Login failed");
      }
    }

    const logout = async () => {
      try {
        await axios.post("/api/auth/logout");
        setAuthUser(null);
        setOnlineUsers([]);
        if (socketRef.current) socketRef.current.disconnect();
        toast.success("Logged out successfully");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Logout failed");
      }
    };

    
    const updateProfile = async (formData) => {
      try {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true 
        };

        const { data } = await axios.put("/api/auth/update-profile", formData, config);

        if (data?.success) {
          toast.success("Profile updated successfully");
          setAuthUser((prev) => ({
            ...prev,
            ...data.data.updateData,  // merge updated data
          }));
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to update profile");
        console.error("Update error:", err);
      }
    };


  //Check auth on mount
  useEffect(() => {
    checkAuthStatus();
    // Cleanup socket on unmount
    return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
      }
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        checkAuthStatus,
        updateProfile
    }

    return (
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    )
}