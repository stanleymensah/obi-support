import { LayoutGrid, Ticket, UserRoundCog } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "../ui/sidebar";
import { useAuth } from "@/context/AuthContext";

const navGeneral = [
  {
    url: "/dashboard",
    name: "Dashboard",
    icon: <LayoutGrid size={16} />,
  },
  {
    url: "/tickets",
    name: "Tickets",
    icon: <Ticket size={16} />,
  },
  {
    url: "/manage-users",
    name: "Users",
    icon: <UserRoundCog size={16} />,
  },
];

export default function AppSidebar() {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();
  const navItems = navGeneral.filter((nav) => nav.name !== "Users" || isAdmin);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2 w-full px-2">
                <img
                  src="/images/help.png"
                  alt="Obi Support Logo"
                  className="w-6 shrink-0"
                />
                <h4 className="text-azure-dark text-lg font-semibold truncate group-data-[state=collapsed]:hidden">
                  Obi Support
                </h4>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((nav, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild isActive={pathname === nav.url}>
                    <Link
                      to={nav.url}
                      className="flex items-center gap-2 w-full"
                    >
                      {nav.icon}
                      {nav.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
