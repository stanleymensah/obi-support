import { useMemo } from "react";
import { useTickets } from "./useTickets";

export function useDashboardStats() {
  const { data: tickets, isLoading } = useTickets();

  const stats = useMemo(() => {
    const allTickets = tickets || [];

    const total = allTickets.length;
    const open = allTickets.filter((t) => t.status === "Open").length;
    const closed = allTickets.filter((t) => t.status === "closed").length;
    const resolved = allTickets.filter((t) => t.status === "resolved").length;
    const reopened = allTickets.filter((t) => t.status === "reopened").length;
    const assigned = allTickets.filter((t) => {
      const assignee = String(t.assignee || "").trim();
      const status = String(t.status || "").trim().toLowerCase();
      return assignee !== "" && status === "assigned";
    }).length;
    const inProgress = allTickets.filter(
      (t) => t.status === "in-progress",
    ).length;
    const high = allTickets.filter((t) => t.priority === "High").length;
    const medium = allTickets.filter((t) => t.priority === "Medium").length;
    const low = allTickets.filter((t) => t.priority === "Low").length;

    const statusData = [
      { name: "Open", value: open, color: "#9EF56B" },
      { name: "Closed", value: closed, color: "#8E94F2" },
      { name: "In-Prog", value: inProgress, color: "#6BB7F5" },
      {name: "Assigned", value: assigned, color: "#267352" },
      {name: "Resolved", value: resolved, color: "#267352" },
      {name: "Reopened", value: reopened, color: "#267352" },
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
      assigned,
      resolved,
      reopened
    };
  }, [tickets]);

  return { ...stats, isLoading };
}
