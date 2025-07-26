import { Outlet } from "react-router-dom"
import bgImage from "./assets/chat-app-assets/bgImage.svg";

function App() {

  return (
    <div
      className="h-screen w-full bg-no-repeat bg-cover bg-center flex items-center justify-center  sm:px-[15%] sm:py-[5%]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}

export default App
