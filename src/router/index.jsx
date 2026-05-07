import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import Tickets from "../pages/tickets/Tickets";
import Users from "../pages/users/Users";
import Auth from "@/pages/auth/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/tickets",
        element: <Tickets />,
      },
      {
        path: "/users",
        element: <Users />,
      },
    ],
  },
]);

export default router;
