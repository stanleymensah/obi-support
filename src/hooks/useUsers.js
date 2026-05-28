import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .order("created_at", { ascending: true })
        .select("*");

      if (error) throw error;

      return (data || []).map((row) => ({
        ...row,
        firstName: row.first_name,
        lastName: row.last_name,
        photoURL: row.photo_url,
        createdAt: row.created_at,
      }));
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
