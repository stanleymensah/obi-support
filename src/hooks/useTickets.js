import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";

export function useTickets() {
  const { user, profile } = useAuth();

  const userId = useMemo(() => user?.id || user?.uid || null, [user?.id, user?.uid]);

  return useQuery({
    queryKey: ["tickets", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .order("created_at", { ascending: false })
        .select("*");

      if (error) throw error;

      return (data || []).map((row) => ({
        ...row,
        assigneeId: row.assignee,
        createdById: row.created_by,
        createdAt: row.created_at,
      }));
    },

    enabled: !!userId,
  });
}
