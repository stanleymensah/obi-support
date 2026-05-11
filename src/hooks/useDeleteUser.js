import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
            toast.success("User deleted successfully.", {
                className: "bg-azure-pop text-white border-azure-pop",
            });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete user.", {
                className: "bg-white text-rose-600 border-rose-200",
            });
        }
    })
}

