import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <>
    <main className="w-full grid grid-cols-12 gap-4 p-4 h-screen overflow-hidden bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
      <div className="col-span-2 h-full min-h-0">
      <Sidebar />
      </div>

      <div className="col-span-10 h-full min-h-0 overflow-auto">
        <Outlet />
      </div>
    </main>
    </>
  )
}
