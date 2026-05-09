import Sidebar from "./Sidebar";
import { Link, useNavigate, Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Layout() {
  const [dropdown, setDropdown] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const hanldeLogout = async () => {
    try {
      setDropdown(false);
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  if (loading) return <div>Loading Profile...</div>;

  if (!profile) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <main className="relative w-full grid grid-cols-12 gap-4 p-4 h-screen overflow-hidden bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
        <div className="col-span-2 h-full min-h-0">
          <Sidebar />
        </div>

        <div className="col-span-10 h-full min-h-0 overflow-auto flex flex-col gap-2">
          <Header showDropdown={() => setDropdown(!dropdown)} />

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </main>
      
      {dropdown && (
        <>
          {/* 1. Invisible Full-Screen Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-transparent" // fixed covers the whole screen
            onClick={() => setDropdown(false)}
          />

          {/* 2. The Menu (Z-index must be higher than backdrop) */}
          <div className="bg-white border absolute z-50 top-16 right-4 flex flex-col px-2 rounded-md shadow-xl py-1 overflow-hidden min-w-35">
            <button
              className="w-full text-left"
              onClick={() => setDropdown(false)}
            >
              <Link
                to={`/users/${user?.uid}`}
                className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <UserRound size={14} />
                <span className="text-xs">Profile</span>
              </Link>
            </button>

            <hr className="border-gray-100" />

            <button
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
              onClick={hanldeLogout}
            >
              <LogOut size={14} />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </>
      )}
    </>
  );
}
