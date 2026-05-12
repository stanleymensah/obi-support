import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Trash2, UserRoundPen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function UsersTable({
  users,
  onDelete,
  onEdit,
  onView,
  sortOrder,
  onToggleSort,
}) {
  return (
    <>
      <Table>
        {users.length === 0 && (
          <TableCaption>
            No Users found.
          </TableCaption>
        )}
        {/* <TableCaption>A list of all users.</TableCaption>{" "} */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-20 hidden md:table-cell">ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">
              <button
                type="button"
                onClick={onToggleSort}
                className="inline-flex items-center gap-1 text-right font-medium hover:text-azure-pop"
              >
                <span className="text-xs">Joined</span>
                {sortOrder === "asc" ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                )}
              </button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              onClick={() => {
                onView(user);
              }}
            >
              <TableCell className="font-medium py-2 hidden md:table-cell">
                U-{user.id.slice(0, 5)}
              </TableCell>
              <TableCell className="py-6 md:py-2">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="py-2 hidden md:table-cell">{user.email}</TableCell>
              <TableCell className="py-2 capitalize">{user.role}</TableCell>
              <TableCell className="text-right py-2">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell className="text-right py-6 md:py-2 flex items-center justify-end gap-1 space-x-2">
                <button
                  className="text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}
                >
                  <UserRoundPen size={16} />
                </button>
                <button
                  className="text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user.id);
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
