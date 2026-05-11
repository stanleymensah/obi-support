import TicketsTable from "./TicketsTable";
import { useTickets } from "@/hooks/useTickets";
import { useState } from "react";
import CreateTicketForm from "./CreateTicketForm";
import Modal from "@/components/common/Modal";
import { useDeleteTicket } from "@/hooks/useDeleteTicket";
import ConfirmModal from "@/components/common/ConfirmModal";
import EditTicketForm from "./EditTicketForm";
import TicketDetails from "./TicketDetails";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import TicketComments from "./Comments";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { sortByCreatedAt } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";
import usePagination from "@/hooks/usePagination";
import { useTicketFilters } from "@/hooks/useTicketFilters";
import Pagination from "@/components/common/Pagination";

export default function Tickets() {
  const { data: tickets, isLoading, error } = useTickets();
  const [isCreating, setIsCreating] = useState(false);
  const deleteMutation = useDeleteTicket();
  const [isDeleting, setIsDeleting] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [ticketToView, setTicketToView] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [commentTicket, setCommentTicket] = useState(null);
  const { profile } = useAuth();
  const [sortOrder, setSortOrder] = useState("asc");
  const [confirmText, setConfirmText] = useState("");
const targetTicket = (tickets || []).find((t) => t.id === ticketToDelete);


  const debouncedSearch = useDebounce(searchTerm);

  const sortedTickets = useMemo(() => {
    return sortByCreatedAt(tickets || [], sortOrder);
  }, [tickets, sortOrder]);

  const {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredTickets,
  } = useTicketFilters(tickets, sortedTickets, debouncedSearch);
  const pagination = usePagination(filteredTickets, 8);

  const handleComment = (ticket) => {
    setCommentTicket(ticket);
    setIsComment(true);
  };

  const handleCloseComment = () => {
    setCommentTicket(null);
    setIsComment(false);
  };

  const handleView = (ticket) => {
    setTicketToView(ticket);
    setIsViewing(true);
  };

  const handleCloseView = () => {
    setTicketToView(null);
    setIsViewing(false);
  };

  const handleDelete = (ticketId) => {
    setTicketToDelete(ticketId);
    setIsDeleting(true);
  };

  const handleEdit = (ticket) => {
    setTicketToEdit(ticket);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTicketToEdit(null);
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    if (ticketToDelete) {
      deleteMutation.mutate(ticketToDelete);
      setIsDeleting(false);
      setTicketToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setTicketToDelete(null);
    setConfirmText("");
  };

  const handleToggleSort = () => {
    setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
  };

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center">
        Loading tickets <Spinner />
      </div>
    );
    

  return (
    <>
      <div className="tickets border h-full rounded-md bg-white flex flex-col overflow-hidden">
        <div className="top flex items-center justify-between py-2 px-4 text-white bg-azure-pop shrink-0">
          <h4>Support</h4>
        </div>

        <div className="w-full px-4 flex flex-col flex-1 min-h-0">
          <div className="w-full flex items-center justify-between text-gray-600 py-4 shrink-0">
            <div className="search border py-1.5 px-3 rounded-sm flex items-center gap-1 w-1/2">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search by title, description, email..."
                className="text-xs w-full"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border py-1 px-2 rounded-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In Progress</option>
                {/* etc... */}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs border py-1 px-2 rounded-sm bg-white"
              >
                <option value="all">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                {/* etc... */}
              </select>

              <div className="flex items-center gap-2">
                {profile?.role ? (
                  <div className="create-new">
                    <button
                      className="create text-sm bg-azure-pop text-white px-3 py-1 rounded-xs"
                      onClick={() => setIsCreating(true)}
                    >
                      Create
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <TicketsTable
              tickets={pagination.currentItems}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleView}
              onComment={handleComment}
              profile={profile}
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
          <CreateTicketForm onClose={() => setIsCreating(false)} />
        </Modal>
      )}

      {isComment && (
        <Modal size="md" title="Comment" onClose={handleCloseComment}>
          <TicketComments ticketId={commentTicket.id} profile={profile} />
        </Modal>
      )}

      {isEditing && (
        <Modal size="sm" title="Edit Ticket" onClose={handleCancelEdit}>
          <EditTicketForm ticket={ticketToEdit} onClose={handleCancelEdit} />
        </Modal>
      )}

      {isViewing && (
        <Modal size="sm" title={ticketToView.title} onClose={handleCloseView}>
          <TicketDetails ticket={ticketToView} />
        </Modal>
      )}

      {isDeleting && (
        <ConfirmModal
          title="Delete Ticket"
          message="This will permanently delete this ticket and all associated comments."
          confirmId={ticketToDelete} // This triggers the "Type to confirm" logic
          onApprove={handleConfirmDelete}
          onCancel={handleCancelDelete}
          onClose={handleCancelDelete}
          approve="Delete Permanently"
          disabled={confirmText !== targetTicket?.title}
        />
      )}
    </>
  );
}
