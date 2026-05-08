import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTickets } from "./useTickets";

export function useDashboardStats() {
  const { user, profile } = useAuth();
  const { data: tickets, isLoading } = useTickets(user, profile);

  const stats = useMemo(() => {
    const allTickets = tickets || [];

    const total = allTickets.length;
    const open = allTickets.filter((t) => t.status === "Open").length;
    const closed = allTickets.filter((t) => t.status === "Closed").length;
    const inProgress = allTickets.filter(
      (t) => t.status === "In-Progress",
    ).length;
    const high = allTickets.filter((t) => t.priority === "High").length;
    const medium = allTickets.filter((t) => t.priority === "Medium").length;
    const low = allTickets.filter((t) => t.priority === "Low").length;

    const statusData = [
      { name: "Open", value: open, color: "#9EF56B" },
      { name: "Closed", value: closed, color: "#8E94F2" },
    ];

    const priorityData = [
      { name: "High", value: high, color: "#F7A431" },
      {
        name: "Medium",
        value: allTickets.filter((t) => t.priority === "Medium").length,
        color: "#6BB7F5",
      },
      {
        name: "Low",
        value: allTickets.filter((t) => t.priority === "Low").length,
        color: "#C86DF1",
      },
    ];

    return {
      total,
      open,
      closed,
      high,
      statusData,
      priorityData,
      inProgress,
      medium,
      low,
    };
  }, [tickets]);

  return { ...stats, isLoading };
}
