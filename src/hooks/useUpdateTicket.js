import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, updates }) => {
      const dbUpdates = { ...updates };
      if (Object.prototype.hasOwnProperty.call(dbUpdates, "assigneeId")) {
        dbUpdates.assignee = dbUpdates.assigneeId || null;
        delete dbUpdates.assigneeId;
      }

      const { error } = await supabase.from("tickets").eq("id", ticketId).update(dbUpdates);
      if (error) throw error;

      return updates;
    },
    onSuccess: (updates, { ticketId }) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });

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