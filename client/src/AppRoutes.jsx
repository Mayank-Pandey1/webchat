import { useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate
} from "react-router-dom";

import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const AppRoutes = () => {
  const { authUser } = useContext(AuthContext);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={authUser ? <HomePage /> : <Navigate to="login" />} />
        <Route path="login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="profile" element={authUser ? <ProfilePage /> : <Navigate to="login" />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default AppRoutes;
