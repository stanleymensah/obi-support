import TicketsTable from "./TicketsTable";
import { useTickets } from "@/hooks/useTickets";
import { useState } from "react";
import CreateTicketForm from "./CreateTicketForm";
import Modal from "@/components/common/Modal";

export default function Tickets() {
  const { data: tickets, isLoading, error } = useTickets();
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) return <div>Loading tickets...</div>;

  return (
    <>
      <div className="tickets border h-full rounded-md bg-white flex flex-col gap-4">
        <div className="top flex items-center justify-between py-2 px-4 text-white bg-azure-pop rounded-t-sm">
          <h4>Support</h4>
        </div>

        <div className="w-full px-4 flex flex-col gap-2">
          <div className="w-full flex items-center justify-between">
            <div className="search border py-1.5 px-3 rounded-sm flex items-center w-1/2">
              <input
                type="text"
                placeholder="Search by title, description, email..."
                className="text-xs w-full"
              />
            </div>

            <div className="create-new">
              <button
                className="create text-sm bg-azure-pop text-white px-3 py-1 rounded-xs"
                onClick={() => setIsCreating(true)}
              >
                Create
              </button>
            </div>
          </div>

          <TicketsTable tickets={tickets || []} />
        </div>

        {error && (
          <div className="w-full px-16 flex items-center justify-center">
            <span className="text-red-500">
              There was an error: {error.message}
            </span>
          </div>
        )}
      </div>

      {isCreating && (
        <Modal size="sm" title="Create" onClose={() => setIsCreating(false)} >
            <CreateTicketForm onClose={()=>setIsCreating(false)} />
        </Modal>
      )}
    </>
  );
}
