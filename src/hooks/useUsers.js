import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export function useUsers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    const cached = queryClient.getQueryData(["users"]);
    if (cached) return;

    (async () => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      if (!mounted) return;
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      queryClient.setQueryData(["users"], users);
    })();

    return () => {
      mounted = false;
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return queryClient.getQueryData(["users"]) || [];
    },
    enabled: true,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
