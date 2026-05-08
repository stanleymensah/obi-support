import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteTicket(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ticketId) => {
            await deleteDoc(doc(db, 'tickets', ticketId));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tickets']})
        },
        onError: (err) => alert("Failed to delete: " + err.message)
    })
}

