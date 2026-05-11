import { doc, updateDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, updates }) => {
      await updateDoc(doc(db, "tickets", ticketId), updates);
      return updates;
    },
    onSuccess: (updates, { ticketId }) => {
      const ticketQueries = queryClient.getQueriesData({ queryKey: ["tickets"] });

      if (ticketQueries?.length) {
        ticketQueries.forEach(([key, value]) => {
          if (!value) return;

          queryClient.setQueryData(key, (current = []) =>
            current.map((ticket) =>
              ticket.id === ticketId ? { ...ticket, ...updates } : ticket
            )
          );
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["tickets"] });
      }

      toast.success("Ticket updated successfully.", {
        className: "bg-azure-pop text-white border-azure-pop",
      });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update ticket.", {
        className: "bg-white text-rose-600 border-rose-200",
      });
    },
  });
}