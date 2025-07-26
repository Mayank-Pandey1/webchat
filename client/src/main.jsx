import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import LoginPage from './pages/LoginPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element = {<App />}>
      <Route path="" element = {< HomePage/>} />
      <Route path='login' element = {<LoginPage />} />
      <Route path='profile' element = {<ProfilePage/>} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
