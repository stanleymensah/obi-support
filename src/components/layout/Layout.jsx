/* eslint-disable no-unused-vars */
import Sidebar from "./Sidebar";
import { Link, useNavigate, Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Spinner from "../ui/spinner";
import Footer from "./Footer";

export default function Layout() {
  const [dropdown, setDropdown] = useState(false);
  const { user, profile, loading } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setDropdown(false);
      localStorage.removeItem("supabase_access_token");
      localStorage.removeItem("supabase_user");
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
    } catch (err) {
      // fail gracefully
      console.error(err?.message || err);
    }
  };
  if (loading)
    return (
      <div className="w-full flex items-center justify-center">
        Loading Profile <Spinner />{" "}
      </div>
    );
  if (!profile) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <main className="relative w-full flex flex-col md:grid md:grid-cols-12 gap-0.5 p-1 h-screen overflow-hidden bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
        <div className="hidden md:flex md:col-span-2 md:h-full md:min-h-0">
          <Sidebar />
        </div>

        <div className="w-full md:col-span-10 h-full min-h-0 overflow-y-auto flex flex-col gap-0.5">
          <Header showDropdown={() => setDropdown(!dropdown)} />

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>

          <Footer />
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
          <div className="bg-white border absolute z-50 top-16 right-4 flex flex-col rounded-md shadow-xl overflow-hidden min-w-35">
            {/* <button
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
            </button> */}

            {/* <hr className="border-gray-100" /> */}

            <button
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
              onClick={handleLogout}
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
