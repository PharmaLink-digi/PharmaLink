import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Medications from './Medications/Medications';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/allmedicines",
    element: <Medications />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <RouterProvider router={router} />

)