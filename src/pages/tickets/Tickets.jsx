import TicketsTable from "./TicketsTable";
import { useTickets } from "@/hooks/useTickets";

export default function Tickets() {
  const { data: tickets, isLoading, error } = useTickets();

  if (isLoading) return <div>Loading tickets...</div>;

  return (
    <>
      <div className="tickets border h-full rounded-xl py-2 px-3 bg-white flex flex-col gap-6">
        <div className="top flex items-center justify-between">
          <h3>Support Tickets</h3>

          <div className="w-1/2">
            <div className="search col-span-2 border py-2 px-3 rounded-md flex items-center inset-shadow-sm">
              <input
                type="text"
                placeholder="Search by title, description, email..."
                className="text-sm"
              />
            </div>
          </div>
        </div>

          <div className="w-full px-16">
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
    </>
  );
}
