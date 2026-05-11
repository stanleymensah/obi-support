import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setUser(firebaseUser);
        setProfile(userDoc.exists() ? userDoc.data() : null);
      } else {
        setUser(null);
        setProfile(null);
        // Clear cached users and tickets when signing out
        try {
          queryClient.removeQueries({ queryKey: ["users"] });
          queryClient.removeQueries({ queryKey: ["tickets"] });
        } catch (e) {
          // ignore if queryClient not ready
          console.log(e.message)
        }
      }
      setLoading(false);
    });
  }, [queryClient]);

  return (
    <>
      <AuthContext.Provider
        value={{ loading, user, profile, isAdmin: profile?.role === "admin" }}
      >
        {!loading && children}
      </AuthContext.Provider>
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
