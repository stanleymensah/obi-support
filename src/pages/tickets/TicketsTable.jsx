import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, SquarePen, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { NoTickets } from "@/components/common/NoTickets";
import { useEffect, useRef, useState } from "react";
import Modal from "@/components/common/Modal";

const priorityVariants = {
  low: "outline",
  medium: "default",
  high: "destructive",
};

const getValidTransitions = (currentStatus) => {
  const normalized = String(currentStatus || "closed")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const transitions = {
    open: ["assigned"],
    assigned: ["in-progress"],
    "in-progress": ["resolved"],
    resolved: ["closed", "reopened"],
    reopened: ["in-progress"],
    closed: [],
  };

  return transitions[normalized] || [];
};

const getDisplayNumber = (ticket) => {
  if (ticket.ticketNumber) return ticket.ticketNumber;
  if (ticket.id) {
    const numeric = String(ticket.id)
      .split("")
      .reduce((total, char, index) => {
        return (total + char.charCodeAt(0) * (index + 1)) % 1000;
      }, 0);
    return String(numeric).padStart(3, "0");
  }
  return "000";
};

// Each row gets its own StatusDropdown so the outside-click ref
// is scoped per-ticket and not shared across all rows.
function StatusDropdown({ ticket, onUpdate, onOpenAssignmentModal }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const transitions = getValidTransitions(ticket.status);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (transitions.length > 0) {
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPos({
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
            });
            setOpen((prev) => !prev);
          }
        }}
        disabled={transitions.length === 0}
        className="inline-flex items-center gap-1 hover:text-brand disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Badge className="capitalize">
          {ticket.status?.replace(/-/g, " ")}
        </Badge>
        {open ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            minWidth: 128,
          }}
          className="rounded-sm bg-card border border-border shadow-sm z-50"
        >
          <ul className="py-0.5">
            {transitions.map((opt) => (
              <li key={opt}>
                <button
                  className="w-full text-left px-2 py-1 text-xs hover:bg-muted capitalize"
                  onClick={() => {
                    setOpen(false);
                    if (opt === "assigned") {
                      onOpenAssignmentModal(ticket.id);
                    } else if (onUpdate) {
                      const formattedLabel = opt
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase());
                      onUpdate({ status: formattedLabel }, ticket.id);
                    }
                  }}
                >
                  {opt.replace(/-/g, " ")}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TicketsTable({
  tickets,
  onDelete,
  onEdit,
  onView,
  onUpdate,
  sortOrder,
  onToggleSort,
  users = [],
}) {
  const [assignmentModal, setAssignmentModal] = useState({
    open: false,
    ticketId: null,
  });

  const handleAssignUser = (userId) => {
    if (onUpdate) {
      onUpdate(
        { status: "Assigned", assigneeId: userId },
        assignmentModal.ticketId,
      );
    }
    setAssignmentModal({ open: false, ticketId: null });
  };

  if (!tickets || tickets.length === 0) {
    return <NoTickets />;
  }

  return (
    <>
      {assignmentModal.open && (
        <Modal
          isOpen={assignmentModal.open}
          onClose={() => setAssignmentModal({ open: false, ticketId: null })}
          title="Assign Ticket"
        >
          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No users available
              </p>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleAssignUser(user.id)}
                  className="w-full text-left px-4 py-2 rounded-sm hover:bg-muted transition-colors text-sm"
                >
                  {user.displayName || user.email}
                </button>
              ))
            )}
          </div>
        </Modal>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 hidden md:table-cell">ID</TableHead>
            <TableHead className="min-w-50">Title</TableHead>
            <TableHead className="w-30 hidden md:table-cell">
              <button
                type="button"
                onClick={onToggleSort}
                className="inline-flex items-center gap-1 text-left font-medium hover:text-azure-pop"
              >
                <span className="text-xs">Created</span>
                {sortOrder === "asc" ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                )}
              </button>
            </TableHead>
            <TableHead className="w-30 text-center">Priority</TableHead>
            <TableHead className="w-25 text-center hidden md:table-cell">
              Status
            </TableHead>
            <TableHead className="w-30 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow
              key={ticket.id}
              onClick={() => {
                onView(ticket);
              }}
            >
              <TableCell className="font-medium py-2 hidden md:table-cell">
                T-{getDisplayNumber(ticket)}
              </TableCell>
              <TableCell className=" py-6 md:py-2">{ticket.title}</TableCell>
              <TableCell className="py-2 hidden md:table-cell">
                {formatRelativeTime(ticket.createdAt)}
              </TableCell>
              <TableCell className="py-2 text-center">
                <Badge
                  variant={
                    priorityVariants[ticket.priority?.toLowerCase()] ||
                    "outline"
                  }
                  className="capitalize"
                >
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-2 hidden md:table-cell">
                <StatusDropdown
                  ticket={ticket}
                  onUpdate={onUpdate}
                  onOpenAssignmentModal={(ticketId) =>
                    setAssignmentModal({ open: true, ticketId })
                  }
                />
              </TableCell>
              <TableCell className="py-2 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(ticket);
                    }}
                    className="p-1 rounded-sm hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <SquarePen size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(ticket.id);
                    }}
                    className="p-1 rounded-sm hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}