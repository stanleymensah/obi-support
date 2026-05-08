import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import Tickets from "../pages/tickets/Tickets";
import Users from "../pages/users/Users";
import Auth from "@/pages/auth/Auth";
import UserPage from "@/pages/users/UserPage";

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
        path: "/manage-users",
        element: <Users />,
      },
      {
        path: "/users/:id",
        element: <UserPage />
      }
    ],
  },
]);

export default router;
