import { formatDate } from "@/lib/utils";

export default function TicketDetails({ ticket }) {
  return (
    <div className="flex flex-col gap-3 p-1">
      {/* Description Section */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-medium  tracking-wider ">
          Description
        </h4>
        <div className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-sm text-sm text-gray-700 leading-relaxed shadow-inner">
          {ticket.description || "No description provided."}
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
         <div className="flex flex-col gap-1">
        <h4 className="text-xs font-medium  tracking-wider ">
          Email
        </h4>
        <span className="text-gray-600 text-xs">{ticket.email}</span>
         
      </div>
         <div className="flex flex-col gap-1">
        <h4 className="text-xs font-medium  tracking-wider ">
          Created:
        </h4>
        <span className="text-gray-600 text-xs">{formatDate(ticket.createdAt)}</span>
         
      </div>
      </div>
     

      <hr />

      {/* Meta Grid */}
      <div className="grid grid-cols-3 gap-4 border-gray-100">
        <div className="col-span-1 flex flex-col gap-1.5">
          <h4 className="text-xs font-medium  ">Status</h4>
          <span className={`w-fit px-3 py-1 rounded-full text-[11px] font-medium border ${
            ticket.status === 'Open' ? 'bg-green-50 text-green-600 border-green-100' : 
            ticket.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
            'bg-gray-100 text-gray-500 border-gray-200'
          }`}>
            {ticket.status}
          </span>
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <h4 className="text-xs font-medium  ">Priority</h4>
          <span className={`w-fit px-3 py-1 rounded-full text-[11px] font-medium border ${
            ticket.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
            ticket.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
            'bg-sky-50 text-sky-600 border-sky-100'
          }`}>
            {ticket.priority}
          </span>
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <h4 className="text-xs font-medium  ">Assignee</h4>
          <span className="text-sm font-medium text-gray-600 truncate">
            {ticket.assignee || "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  );
}
