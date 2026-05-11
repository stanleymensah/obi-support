import { useState, useMemo } from "react";

export function useTicketFilters(tickets, sortedTickets, debouncedSearch) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTickets = useMemo(() => {
    return sortedTickets.filter((ticket) => {
      const query = debouncedSearch.toLowerCase();
      
      const matchesSearch = 
        ticket.title?.toLowerCase().includes(query) ||
        ticket.description?.toLowerCase().includes(query) ||
        ticket.email?.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [sortedTickets, debouncedSearch, statusFilter, priorityFilter]);

  return {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredTickets,
  };
}
