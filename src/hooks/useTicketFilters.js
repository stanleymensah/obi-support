import { useState, useMemo } from "react";
import { isTicketAssignedToProfile } from "@/lib/assignee";

export function useTicketFilters(tickets, sortedTickets, debouncedSearch, profile, userId) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTickets = useMemo(() => {
    return sortedTickets.filter((ticket) => {
      const query = debouncedSearch.toLowerCase();
      
      const matchesSearch = 
        ticket.title?.toLowerCase().includes(query) ||
        ticket.description?.toLowerCase().includes(query) ||
        ticket.email?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "assigned_to_me"
          ? isTicketAssignedToProfile(ticket, profile, userId)
          : ticket.status === statusFilter);
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [sortedTickets, debouncedSearch, statusFilter, priorityFilter, profile, userId]);

  return {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredTickets,
  };
}
