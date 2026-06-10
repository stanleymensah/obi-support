import { useAuth } from "@/context/AuthContext";
import {
  ChevronDown,
  PanelBottomClose,
  UserRound,
  ListCollapse,
} from "lucide-react";
import { isTicketAssignedToProfile } from "@/lib/assignee";
import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import { useTickets } from "@/hooks/useTickets";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export default function Header({ showDropdown }) {
  const { profile, user } = useAuth();
  const { data: tickets = [] } = useTickets();

  const { toggleSidebar } = useSidebar();

  const assignedCount = useMemo(() => {
    if (!profile) return 0;

    return tickets.filter((ticket) =>
      isTicketAssignedToProfile(ticket, profile, user?.uid),
    ).length;
  }, [tickets, profile, user?.uid]);

  return (
    <header className="h-16 md:h-12 border-b shadow-sm px-4 flex items-center bg-white justify-between gap-2 md:gap-4">
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-9 w-9 border hover:bg-slate-50 transition-colors"
        title="Toggle Menu"
      >
        <ListCollapse className="w-4.5 h-4.5 text-gray-500" />
      </Button>

      <div className="hidden md:flex md:flex-1 " />
      {(profile?.role === "admin" || profile?.role === "support") && (
        <Tooltip>
          <TooltipTrigger>
            <NavLink
              to="/tickets/assigned"
              className="hidden md:flex items-center cursor-pointer relative border p-1.5 rounded-full"
            >
              <PanelBottomClose size={18} className="text-gray-500" />
              {assignedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-white">
                  {assignedCount > 99 ? "99+" : assignedCount}
                </span>
              )}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-[10px]">Assigned Tickets</p>
          </TooltipContent>
        </Tooltip>
      )}

      <div
        className="user flex items-center gap-2 cursor-pointer"
        onClick={showDropdown}
      >
        <div className="img w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt={`${profile?.firstName} ${profile?.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserRound size={18} className="text-gray-600" />
          )}
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
  );
}
