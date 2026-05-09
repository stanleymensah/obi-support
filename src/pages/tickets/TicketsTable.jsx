import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen, Trash2, MessageCircleMore } from "lucide-react";

export default function TicketsTable({ tickets, onDelete, onEdit, onView }) {
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
        <TableCaption>A list of all your tickets.</TableCaption>{" "}
        {tickets.length === 0 && (
          <TableCaption className="w-full flex items-center justify-center">
            <p>No tickets</p>
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">ID</TableHead>
            <TableHead className="min-w-50">Title</TableHead>
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
              <TableCell className="py-2">{ticket.priority}</TableCell>
              <TableCell className="text-right py-2">{ticket.status}</TableCell>
              <TableCell className="text-right py-2 flex items-center justify-end gap-1 space-x-2">
                <button className="text-gray-600">
                  <MessageCircleMore size={16} />{" "}
                </button>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
