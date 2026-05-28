import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";

export function useDeleteTicket() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ticketId) => {
            const { error } = await supabase.from("tickets").eq("id", ticketId).delete();
            if (error) throw error;
        },
        onSuccess: (_data, ticketId) => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            toast.success("Ticket deleted successfully.", {
                className: "bg-azure-pop text-white border-azure-pop",
            });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete ticket.", {
                className: "bg-white text-rose-600 border-rose-200",
            });
        },
    });
}

