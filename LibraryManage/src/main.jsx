import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Layout from './Layout.jsx'
import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import Stats from './components/Stats/Stats.jsx'
import About from './components/About/About.jsx'
import Header from './components/Header/Header.jsx'
import StatsWrapper from './components/StatsWrapper/StatsWrapper.jsx'
import BooksWrapper from './components/BooksWrapper/BooksWrapper.jsx'
import QuestionWrapper from './components/QuestionWrapper/QuestionWrapper.jsx'
import OthersWrapper from './components/OthersWrapper/OthersWrapper.jsx'
import Library from './components/Library/Library.jsx'
import { ToastContainer } from "react-toastify";



const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '', // this is `/`
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'stats',
        element: <StatsWrapper /> // only this is protected
      },{
        path: 'books',
        element: <BooksWrapper /> // only this is protected
      },{
        path: 'questionpaper',
        element: <QuestionWrapper /> // only this is protected
      },{
        path: 'library',
        element: <Library />
      },{
        path: 'others',
        element: <OthersWrapper /> //this is protected
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>,
)
