import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteUser(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId) => {
            await deleteDoc(doc(db, 'users', userId));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']})
        },
        onError: (err) => alert("Failed to delete: " + err.message)
    })
}

