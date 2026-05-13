// import TicketWorkflowActions from "@/components/tickets/TicketWorkflowActions";
import { formatDate } from "@/lib/utils";
import { ASSIGNEE_DISPLAY_FIELD, getTicketAssigneeLabel } from "@/lib/assignee";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TicketComments from "./Comments";

const normalizeStatus = (status) =>
  String(status ?? "closed")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const formatStatusLabel = (status) => {
  const normalized = String(status ?? "closed")
    .trim()
    .replace(/[-_]+/g, " ");
  const key = String(status ?? "closed")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (
    key.includes("inprog") ||
    key.includes("inprogress") ||
    key.includes("profress")
  ) {
    return "In-prog";
  }

  const map = {
    assigned: "Assigned",
    open: "Open",
    reopened: "Reopened",
    resolved: "Resolved",
    closed: "Closed",
  };

  if (map[key]) return map[key];

  return normalized
    ? normalized
        .split(/\s+/)
        .filter(Boolean)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
    : "Closed";
};

export default function TicketDetails({
  ticket,
  users,
  profile,
  // effectiveAssignee,
  // canManageTickets = true,
  // onAssigneeChange,
  // onAssign,
  // onStartWork,
  // onMarkResolved,
  // onCloseTicket,
  // onReopenTicket,
}) {
  const status = normalizeStatus(ticket.status);
  const statusKey = String(status ?? "").replace(/[^a-z]/g, "");
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (!ticket?.id) return;
    const colRef = collection(db, "tickets", ticket.id, "comments");
    const q = query(colRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setCommentsCount(snapshot.size || 0);
    });

    return () => unsub();
  }, [ticket?.id]);

  return (
    <div className="flex flex-col gap-3 p-1">
      {/* Description Section */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-medium  tracking-wider ">Description</h4>
        <div className="w-full bg-gray-50/50 border border-gray-100 p-2 rounded-sm text-xs h-20 min-w-92 text-gray-700 leading-relaxed shadow-inner">
          {ticket.description || "No description provided."}
        </div>
      </div>
      <div className="w-full flex items-center gap-4 justify-between">
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-medium  tracking-wider ">Email</h4>
          <span className="text-gray-600 text-xs">{ticket.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-medium tracking-wider ">Assignee</h4>
          <span className="text-xs text-gray-600 truncate">
            {getTicketAssigneeLabel(ticket, users, ASSIGNEE_DISPLAY_FIELD) ||
              "Unassigned"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-medium  tracking-wider ">Created:</h4>
          <span className="text-gray-600 text-xs">
            {formatDate(ticket.createdAt)}
          </span>
        </div>
      </div>

      <hr />
      {/* Meta Grid */}
      <div className="grid grid-cols-4 gap-4 border-gray-100">
        <div className="col-span-1 flex flex-col gap-1.5">
          <h4 className="text-xs font-medium  ">Status</h4>
          <span
            className={`w-fit px-3 py-1 rounded-full text-[11px] font-medium border ${
              statusKey === "open"
                ? "bg-green-50 text-green-600 border-green-100"
                : statusKey === "assigned"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : statusKey === "reopened"
                    ? "bg-violet-50 text-violet-600 border-violet-100"
                    : statusKey === "inprogress"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : statusKey === "resolved"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {formatStatusLabel(ticket.status)}
          </span>
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <h4 className="text-xs font-medium  ">Priority</h4>
          <span
            className={`w-fit px-3 py-1 rounded-full text-[11px] font-medium border ${
              ticket.priority === "High"
                ? "bg-rose-50 text-rose-600 border-rose-100"
                : ticket.priority === "Medium"
                  ? "bg-amber-50 text-amber-600 border-amber-100"
                  : "bg-sky-50 text-sky-600 border-sky-100"
            }`}
          >
            {ticket.priority}
          </span>
        </div>
        {/* 
        <div className="col-span-2 flex flex-col">
          <TicketWorkflowActions
            ticket={ticket}
            users={users}
            effectiveAssignee={effectiveAssignee}
            canManageTickets={canManageTickets}
            onAssigneeChange={onAssigneeChange}
            onAssign={onAssign}
            onStartWork={onStartWork}
            onMarkResolved={onMarkResolved}
            onCloseTicket={onCloseTicket}
            onReopenTicket={onReopenTicket}
          />
        </div> */}
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowComments((s) => !s)}
            className="text-sm text-brand-strong hover:underline"
          >
            {commentsCount} Comments
          </button>
        </div>
        {showComments && (
          <div className="mt-2">
            <TicketComments ticketId={ticket.id} profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
