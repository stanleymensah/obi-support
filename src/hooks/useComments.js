import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, text, userId }) => {
      const { error } = await supabase.from("comments").insert({
        ticket_id: ticketId,
        content: text,
        user_id: userId,
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.ticketId] });
    },
  });
}

export function useTicketComments(ticketId) {
  return useQuery({
    queryKey: ["comments", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true })
        .select("*");

      if (error) throw error;

      return (data || []).map((comment) => ({
        ...comment,
        text: comment.content,
        createdAt: comment.created_at,
      }));
    },
    enabled: !!ticketId,
  });
}
