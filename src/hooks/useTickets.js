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

      if (profile?.role === "admin") {
        const q = query(ticketsRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        if (!mounted) return;
        const tickets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        queryClient.setQueryData(cacheKey, tickets);
        return;
      }

      // support or regular user
      if (profile?.role === "support") {
        // Try to fetch tickets created by the user and tickets assigned to the support user.
        const name = `${profile.firstName} ${profile.lastName}`;
        const qUser = query(ticketsRef, where("userId", "==", user.uid), orderBy("createdAt", "asc"));
        const qAssignedByName = query(ticketsRef, where("assignee", "==", name), orderBy("createdAt", "asc"));
        const qAssignedByEmail = query(ticketsRef, where("assignee", "==", profile.email), orderBy("createdAt", "asc"));

        const [snapUser, snapByName, snapByEmail] = await Promise.all([
          getDocs(qUser),
          getDocs(qAssignedByName),
          getDocs(qAssignedByEmail),
        ]);

        if (!mounted) return;

        const map = new Map();
        [...snapUser.docs, ...snapByName.docs, ...snapByEmail.docs].forEach((doc) => {
          map.set(doc.id, { id: doc.id, ...doc.data() });
        });

        const tickets = Array.from(map.values()).sort((a, b) => {
          const aMs = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime());
          const bMs = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime());
          return aMs - bMs;
        });

        queryClient.setQueryData(cacheKey, tickets);
        return;
      }

      // regular user: only tickets they created
      const q = query(ticketsRef, where("userId", "==", user.uid), orderBy("createdAt", "asc"));
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
