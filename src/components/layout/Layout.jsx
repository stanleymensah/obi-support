import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateTicketForm from "@/pages/tickets/CreateTicketForm";
import Header from "./Header";

export default function Layout() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <main className="relative w-full grid grid-cols-12 gap-4 p-4 h-screen overflow-hidden bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
        <div className="col-span-2 h-full min-h-0">
          <Sidebar />
        </div>

        <div className="col-span-10 h-full min-h-0 overflow-auto flex flex-col gap-2">
          <Header dowhat={()=>setIsCreating(true)} />
          <Outlet />

          <div className="absolute z-30 bottom-8 right-8 transition-opacity opacity-50 hover:opacity-100 md:hidden">
            <button
              className="create-ticket p-3 bg-azure-pop text-white rounded-full shadow-lg"
              onClick={() => setIsCreating(true)}
            >
              <Plus />
            </button>
          </div>

          {isCreating && (
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/80"
                onClick={() => setIsCreating(false)}
              />

              <div className="relative z-10">
                <CreateTicketForm onClose={() => setIsCreating(false)} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
