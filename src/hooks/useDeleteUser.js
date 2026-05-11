import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteUser(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId) => {
            await deleteDoc(doc(db, 'users', userId));
        },
        onSuccess: (_data, userId) => {
            const users = queryClient.getQueryData(['users']);
            if (users) {
                queryClient.setQueryData(['users'], users.filter(u => u.id !== userId));
            } else {
                queryClient.invalidateQueries({queryKey: ['users']});
            }
        },
        onError: (err) => alert("Failed to delete: " + err.message)
    })
}

