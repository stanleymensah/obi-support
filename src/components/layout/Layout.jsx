import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// import { Plus } from "lucide-react";
import Header from "./Header";

export default function Layout() {

  return (
    <>
      <main className="relative w-full grid grid-cols-12 gap-4 p-4 h-screen overflow-hidden bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
        <div className="col-span-2 h-full min-h-0">
          <Sidebar />
        </div>

        <div className="col-span-10 h-full min-h-0 overflow-auto flex flex-col gap-2">
          <Header/>
          <Outlet />

          {/* <div className="absolute z-30 bottom-8 right-8 transition-opacity opacity-50 hover:opacity-100 md:hidden">
            <button
              className="create-ticket p-3 bg-azure-pop text-white rounded-full shadow-lg"
              onClick={() => setIsCreating(true)}
            >
              <Plus />
            </button>
          </div> */}

        </div>
      </main>
    </>
  );
}
