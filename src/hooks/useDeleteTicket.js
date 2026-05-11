import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        },
        onError: (err) => alert("Failed to delete: " + err.message)
    })
}

