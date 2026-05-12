import { LayoutGrid, Ticket, UserRoundCog } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { profile } = useAuth();
  return (
    <>
      <div className="border rounded-sm flex flex-col gap-4 w-full h-full border-black/10 px-2 bg-white shadow-sm inset-shadow-sm inset-shadow-azure-pop/10">
        <div className="top flex items-center gap-1 w-full justify-center h-12">
          <img src="/images/help.png" alt="" className="w-4" />
          <h4 className="text-azure-dark">Obi Support</h4>
        </div>

        <div className="links-container flex flex-col gap-3">
          <span className="uppercase text-xs">menu</span>

          <div className="links w-full flex flex-col gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "link-active" : "link")}
            >
              <LayoutGrid size={16} />
              <p className="text-xs md:text-sm">Dashboard</p>
            </NavLink>
            <NavLink
              to="/tickets"
              className={({ isActive }) => (isActive ? "link-active" : "link")}
            >
              <Ticket size={16} />
              <text className="text-xs md:text-sm">Ticket</text>
            </NavLink>
            {profile?.role === "admin" ? (
              <>
                <NavLink
                  to="/manage-users"
                  className={({ isActive }) =>
                    isActive ? "link-active" : "link"
                  }
                >
                  <UserRoundCog size={16} />
                  <text className="text-xs md:text-sm">Manage User</text>
                </NavLink>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}
