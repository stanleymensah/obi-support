import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export function useTickets() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.uid) return undefined;

    const ticketsRef = collection(db, "tickets");
    const q =
      profile?.role === "admin"
        ? query(ticketsRef, orderBy("createdAt", "desc"))
        : query(
            ticketsRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
          );

    const unsub = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      queryClient.setQueryData(["tickets", user.uid], tickets);
    });

    return () => unsub();
  }, [profile?.role, queryClient, user?.uid]);

  return useQuery({
    queryKey: ["tickets", user?.uid],
    queryFn: () => {
      return queryClient.getQueryData(["tickets", user?.uid]) || [];
    },

    enabled: !!user?.uid,
    staleTime: Infinity,
  });
}
