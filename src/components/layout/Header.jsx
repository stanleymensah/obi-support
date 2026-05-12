import { useAuth } from "@/context/AuthContext";
import { ChevronDown, Ticket, LayoutGrid, UserRoundCog } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Header({ showDropdown }) {
  // eslint-disable-next-line no-unused-vars
  const { profile, user } = useAuth();

  return (
    <>
      <header className="h-16 md:h-12 rounded-sm border shadow-sm px-4 flex items-center bg-white justify-between md:justify-end gap-2">
        <div className="flex items-center gap-1 md:hidden">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "link-active-m" : "link-m")}
          >
            <LayoutGrid size={16} />
            {/* <p className="text-xs">Dashboard</p> */}
          </NavLink>

          <NavLink
            to="/tickets"
            className={({ isActive }) => (isActive ? "link-active-m" : "link-m")}
          >
            <Ticket size={16} />
            {/* <text className="text-xs">Ticket</text> */}
          </NavLink>

          {profile?.role === "admin" ? (
            <>
              <NavLink
                to="/manage-users"
                className={({ isActive }) =>
                  isActive ? "link-active-m" : "link-m"
                }
              >
                <UserRoundCog size={16} />
                {/* <text className="text-xs md:text-sm">User</text> */}
              </NavLink>
            </>
          ) : (
            ""
          )}
        </div>
        <div
          className="user flex items-center gap-2 cursor-pointer"
          onClick={showDropdown}
        >
          <div className="img w-7">
            <img
              src="/images/pfp.jpg"
              alt=""
              className="object-cover rounded-full"
            />
          </div>
          <div className="name flex flex-col justify-center">
            <p className="font-medium text-xs">
              {profile ? `${profile.firstName} ${profile.lastName}` : "Guest"}
            </p>
            <span className="text-xs -mt-1 inline-flex items-center gap-1">
              @{profile?.role || "user"} <ChevronDown size={14} />{" "}
            </span>
          </div>
        </div>
      </header>
    </>
  );
}
