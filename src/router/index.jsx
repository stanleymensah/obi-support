import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import Tickets from "../pages/tickets/Tickets";
import Users from "../pages/users/Users";

const router = createBrowserRouter(
    [
        {
            element: <Layout />,
            children: [
                {
                    path: "/",
                    element: <Dashboard />
                }, 
                {
                    path: "/tickets",
                    element: <Tickets />
                },
                {
                    path: "/users",
                    element: <Users />
                }
            ]
        }
    ]
)

export default router