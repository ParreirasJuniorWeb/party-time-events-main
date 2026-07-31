import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import pages
import ErrorPage from "./routes/ErrorPage/ErrorPage";
import Home from "./routes/Home/Home";
import CreateParty from "./routes/CreateParty/CreateParty";
import Party from "./routes/Party/Party";
import EditParty from "./routes/EditPage/EditParty";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/party/new",
        element: <CreateParty />
      },
      {
        path: "/party/:id",
        element: <Party />
      },
      {
        path: "/party/edit/:id",
        element: <EditParty />
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
