import { Outlet } from "react-router-dom"
import bgImage from "./assets/chat-app-assets/bgImage.svg";
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <div
      className="h-screen w-full bg-no-repeat bg-cover bg-center flex items-center justify-center  sm:px-[15%] sm:py-[5%]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full min-h-screen">
        <Toaster position="top-center" reverseOrder={false} />
        <Outlet />
      </div>
    </div>
  )
}

export default App
