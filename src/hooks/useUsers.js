import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

export function useUsers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Reference to the users collection
    const usersRef = collection(db, "users");
    
    // Sort by creation date so new users appear at the top
    const q = query(usersRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sync the real-time data directly into the React Query cache
      queryClient.setQueryData(["users"], users);
    });

    return () => unsub();
  }, [queryClient]);

  return useQuery({
    queryKey: ["users"],
    queryFn: () => {
      // Pull data from the cache updated by the listener above
      return queryClient.getQueryData(["users"]) || [];
    },
    staleTime: Infinity, // Keep data fresh via the listener only
  });
}
