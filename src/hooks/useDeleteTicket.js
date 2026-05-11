import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteTicket(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ticketId) => {
            await deleteDoc(doc(db, 'tickets', ticketId));
        },
        onSuccess: (_data, ticketId) => {
            // Update all cached ticket lists (admin and per-user) by removing the deleted ticket
            const ticketQueries = queryClient.getQueriesData(['tickets']);
            if (ticketQueries && ticketQueries.length) {
                ticketQueries.forEach(([key, value]) => {
                    if (!value) return;
                    queryClient.setQueryData(key, (prev) => (prev || []).filter(t => t.id !== ticketId));
                });
            } else {
                queryClient.invalidateQueries({queryKey: ['tickets']});
            }
            toast.success("Ticket deleted successfully.", {
                className: "bg-azure-pop text-white border-azure-pop",
            });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete ticket.", {
                className: "bg-white text-rose-600 border-rose-200",
            });
        }
    })
}

