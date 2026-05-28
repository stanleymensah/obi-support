import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId) => {
            const { error } = await supabase.from("users").eq("id", userId).delete();
            if (error) throw error;
        },
        onSuccess: (_data, userId) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User deleted successfully.", {
                className: "bg-azure-pop text-white border-azure-pop",
            });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete user.", {
                className: "bg-white text-rose-600 border-rose-200",
            });
        },
    });
}

