import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export function useTickets() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.uid) return undefined;

    let mounted = true;

    const cacheKey = ["tickets", user.uid];
    const cached = queryClient.getQueryData(cacheKey);
    if (cached) return;

    (async () => {
      const ticketsRef = collection(db, "tickets");
      const q =
        profile
          ? query(ticketsRef, orderBy("createdAt", "asc"))
          : query(
              ticketsRef,
              where("userId", "==", user.uid),
              orderBy("createdAt", "asc"),
            );

      const snapshot = await getDocs(q);
      if (!mounted) return;
      const tickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      queryClient.setQueryData(cacheKey, tickets);
    })();

    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.role, queryClient, user?.uid]);

  return useQuery({
    queryKey: ["tickets", user?.uid],
    queryFn: () => {
      return queryClient.getQueryData(["tickets", user?.uid]) || [];
    },

    enabled: !!user?.uid,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
