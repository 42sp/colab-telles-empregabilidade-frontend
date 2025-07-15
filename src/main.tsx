import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from './pages/login.tsx'
import Home from './pages/home.tsx'
import ScrapData from './pages/scrap-data.tsx'
import Configuration from './pages/configuration.tsx'
import Dashboard from './pages/dashboard.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/scrap-data",
    element: <ScrapData />
  },
  {
    path: "/configuration",
    element: <Configuration />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
