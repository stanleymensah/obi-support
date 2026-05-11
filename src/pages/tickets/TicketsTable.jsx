import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  SquarePen,
  Trash2,
  MessageCircleMore,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  open: "bg-blue-100 text-blue-700 border-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-700 border-gray-100",
};

const priorityVariants = {
  low: "secondary", // Muted gray/neutral
  medium: "default", // Primary brand color
  high: "outline", // Border only (subtle but distinct)
  urgent: "destructive", // Red (high attention)
};

export default function TicketsTable({
  tickets,
  onComment,
  onDelete,
  onEdit,
  onView,
  profile,
  sortOrder,
  onToggleSort,
}) {
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

  return (
    <>
      <Table>
        {tickets.length === 0 && <TableCaption>No tickets found!</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">ID</TableHead>
            <TableHead className="min-w-50">Title</TableHead>
            <TableHead className="w-30">
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
            <TableHead className="w-30">Priority</TableHead>
            <TableHead className="w-25 text-right">Status</TableHead>
            <TableHead className="w-37.5 text-right">Actions</TableHead>
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
              <TableCell className="font-medium py-2">
                T-{getDisplayNumber(ticket)}
              </TableCell>
              <TableCell className="py-2">{ticket.title}</TableCell>
              <TableCell className="py-2">
                {formatRelativeTime(ticket.createdAt)}
              </TableCell>
              <TableCell className="py-2">
                {" "}
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
              <TableCell className="text-right py-2">
                <Badge
                  className={`${statusColors[ticket.status?.toLowerCase()] || "bg-gray-100"} capitalize font-medium`}
                  variant="outline"
                >
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right py-2 flex items-center justify-end gap-1 space-x-2">
                <button
                  className="text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onComment(ticket);
                  }}
                >
                  <MessageCircleMore size={16} />{" "}
                </button>
                {profile?.role === "admin" || profile?.role === "support" ? (
                  <>
                    <button
                      className="text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(ticket);
                      }}
                    >
                      <SquarePen size={16} />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(ticket.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  ""
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
