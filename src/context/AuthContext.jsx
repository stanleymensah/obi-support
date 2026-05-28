import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const restoreSession = async () => {
    setLoading(true);

    try {
      const savedUser = localStorage.getItem("supabase_user");
      if (!savedUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      const { data, error } = await supabase
        .from("users")
        .eq("id", parsedUser.id)
        .select("*");

      if (error) {
        setProfile(null);
      } else {
        const row = data?.[0] || null;
        setProfile(
          row
            ? {
                ...row,
                uid: row.id,
                firstName: row.first_name,
                lastName: row.last_name,
                photoURL: row.photo_url,
                createdAt: row.created_at,
              }
            : null,
        );
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();

    const handleAuthChange = () => {
      restoreSession();
    };

    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
      try {
        queryClient.removeQueries({ queryKey: ["users"] });
        queryClient.removeQueries({ queryKey: ["tickets"] });
      } catch {
        // noop
      }
    };
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
