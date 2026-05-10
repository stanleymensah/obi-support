import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, UserRoundPen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function UsersTable({ users, onDelete, onEdit, onView }) {

  return (
    <>
     <Table>
        {/* <TableCaption>A list of all users.</TableCaption>{" "} */}
        {users.length === 0 && (
          <TableCaption className="w-full flex items-center justify-center">
            <p>No Users</p>
          </TableCaption>
        )}
        <TableHeader>
          <TableRow>
           <TableHead className="w-20">ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Joined</TableHead>
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
              <TableCell className="font-medium py-2">U-{user.id.slice(0, 5)}
              </TableCell>
              <TableCell className="py-2">{user.firstName} {user.lastName}</TableCell>
              <TableCell className="py-2">{user.email}</TableCell>
              <TableCell className="py-2">{user.role}</TableCell>
              <TableCell className="text-right py-2">{formatDate(user.createdAt)}</TableCell>
              <TableCell className="text-right py-2 flex items-center justify-end gap-1 space-x-2">
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
  )
}
