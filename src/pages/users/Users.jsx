import { Search } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UsersTable from "./UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import Modal from "@/components/common/Modal";
import ConfirmModal from "@/components/common/ConfirmModal";
import CreateUserForm from "./CreateUserForm";
import EditUserForm from "./EditUserForm";
import UserDetails from "./UserDetails";
import usePagination from "@/hooks/usePagination";
import Pagination from "@/components/common/Pagination";
import { sortByCreatedAt } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";

export default function Users() {
  const { data: users, isLoading, error } = useUsers();
  const { profile } = useAuth();
  const deleteMutation = useDeleteUser();
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [userToView, setUserToView] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const debouncedSearch = useDebounce(searchTerm);

  const sortedUsers = useMemo(() => {
    return sortByCreatedAt(users || [], sortOrder);
  }, [users, sortOrder]);


  const filteredUsers = sortedUsers.filter((user) => {
    const query = debouncedSearch.toLowerCase();
    return (
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });
  const pagination = usePagination(filteredUsers, 8);

  const handleView = (user) => {
    setUserToView(user);
    setIsViewing(true);
  };

  const handleCloseView = () => {
    setUserToView(null);
    setIsViewing(false);
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setIsDeleting(true);
  };

  const handleEdit = (user) => {
    setUserToEdit(user);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setUserToEdit(null);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setUserToDelete(null);
  };

  const handleToggleSort = () => {
    setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
  };

  if (isLoading) return <div className="w-full flex items-center justify-center">Loading users <Spinner /></div>;

  if (profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="users border h-full rounded-md bg-white flex flex-col overflow-hidden">
        <div className="top flex items-center justify-between py-2 px-4 text-white bg-azure-pop shrink-0">
          <h4>Users</h4>
        </div>

        <div className="w-full px-4 flex flex-col flex-1 min-h-0">
          <div className="w-full flex items-center justify-between text-gray-600 py-4 shrink-0">
            <div className="search border py-1.5 px-3 rounded-sm flex items-center gap-1 w-4/5 md:w-1/2">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search by name, email..."
                className="text-xs py-1 md:py-0 w-full"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <>
              <div className="create-new">
                <button
                  className="create text-sm bg-azure-pop text-white px-3 py-1 rounded-xs"
                  onClick={() => setIsCreating(true)}
                >
                  Create
                </button>
              </div>
            </>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <UsersTable
              users={pagination.currentItems}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleView}
              sortOrder={sortOrder}
              onToggleSort={handleToggleSort}
            />
          </div>
          <div className="bg-gray-50/30 shrink-0">
            <Pagination pagination={pagination} />
          </div>
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
        <Modal size="sm" title="Create" onClose={() => setIsCreating(false)}>
          <CreateUserForm onClose={() => setIsCreating(false)} />
        </Modal>
      )}

      {isEditing && (
        <Modal size="sm" title="Edit User" onClose={handleCancelEdit}>
          <EditUserForm userToEdit={userToEdit} onClose={handleCancelEdit} />
        </Modal>
      )}

      {isViewing && (
        <Modal size="sm" title={userToView.title} onClose={handleCloseView}>
          <UserDetails user={userToView} />
        </Modal>
      )}

      {isDeleting && (
        <ConfirmModal
          title="Confirm Delete"
          message="Are you sure you want to delete this user? "
          onApprove={handleConfirmDelete}
          approve="Delete"
          onCancel={handleCancelDelete}
          onClose={handleCancelDelete}
          confirmId={userToDelete}
        />
      )}
    </>
  );
}
