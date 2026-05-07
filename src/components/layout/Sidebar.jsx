import { LayoutGrid, Ticket, UserRoundCog } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <div className="border rounded-xl flex flex-col gap-8 w-full h-full border-black/10 px-2 bg-white shadow-sm inset-shadow-sm inset-shadow-azure-pop/10">
        <div className="top flex items-center gap-2 w-full justify-center h-12">
          <img src="/images/help.png" alt="" className="w-6" />
          <h3 className="text-azure-pop">Obi Support</h3>
        </div>

        <div className="links-container flex flex-col gap-3">
          <text className="uppercase text-xs">menu</text>

          <div className="links w-full flex flex-col gap-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "link-active" : "link")}
            >
              <LayoutGrid size={16} />
              <text className="text-sm md:text-base">Dashboard</text>
            </NavLink>
            <NavLink
              to="/tickets"
              className={({ isActive }) => (isActive ? "link-active" : "link")}
            >
              <Ticket size={16} />
              <text className="text-sm md:text-base">Tickets</text>
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) => (isActive ? "link-active" : "link")}
            >
              <UserRoundCog size={16} />
              <text className="text-sm md:text-base">Manage Users</text>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
