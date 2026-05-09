import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// 1. Hook to add a comment (This is perfect as is!)
export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, text, userName }) => {
      const colRef = collection(db, "tickets", ticketId, "comments");
      await addDoc(colRef, { text, userName, createdAt: serverTimestamp() });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["comments", variables.ticketId]);
    },
  });
}

// 2. Simple Query Hook
export function useTicketComments(ticketId) {
  return useQuery({
    queryKey: ["comments", ticketId],
    queryFn: () => [], // The real data comes from the listener in the component
    enabled: !!ticketId,
  });
}
