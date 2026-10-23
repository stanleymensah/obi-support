import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/spinner";
import { useUsers } from "@/hooks/useUsers";
import {
  ASSIGNEE_DISPLAY_FIELD,
  findUserByAssigneeValue,
  getUserDisplayLabel,
} from "@/lib/assignee";
import { supabase } from "@/utils/supabase";

export default function EditTicketForm({ onClose, ticket }) {
  // const { user, profile } = useAuth();
  const currentTicket = ticket || {};
  const { data: users = [] } = useUsers();
  const queryClient = useQueryClient();

  const assignableUsers = users.filter((candidate) => {
    const role = String(candidate?.role || "").toLowerCase();
    return role === "support" || role === "admin";
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: currentTicket.title || "",
      email: currentTicket.email || "",
      assigneeId: currentTicket.assigneeId || findUserByAssigneeValue(users, currentTicket.assignee)?.id || "",
      description: currentTicket.description || "",
      status: currentTicket.status || "Open",
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const payload = {
        assignee: updatedData.assigneeId || null,
        description: updatedData.description,
        email: updatedData.email,
        status: updatedData.status,
        title: updatedData.title,
      };

      const { error } = await supabase
        .from("tickets")
        .eq("id", currentTicket.id)
        .update(payload);
      if (error) throw error;

      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket updated successfully.", {
        className: "bg-azure-pop text-white border-azure-pop",
      });
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error("Error updating ticket:", error);
      toast.error(error.message || "Failed to update ticket.", {
        className: "bg-white text-rose-600 border-rose-200",
      });
    },
  });

  const onSubmit = (data) => {
    const selectedUser = findUserByAssigneeValue(users, data.assigneeId);
    mutation.mutate({ ...data, assigneeId: selectedUser?.id || "" });
  };

  if (!ticket) return null;

  return (
      <form className="flex flex-col gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="title">
          <label className="label text-xs font-medium text-gray-600 ">
            Title
          </label>
          <div className="border py-1.5 px-3 rounded-sm flex items-center">
            <input
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 chars",
                },
              })}
              type="text"
              placeholder="Title must be at least 5 chars"
              className="text-xs w-full bg-transparent outline-none"
            />
          </div>
          {errors.title && (
            <p className="text-rose-pop text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="email-ems grid grid-cols-3 gap-2">
          <div className="email col-span-1">
            <label className="label text-xs font-medium text-gray-600 ">
              Email
            </label>
            <div className="border py-1.5 px-3 rounded-sm flex items-center">
              <input
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
                type="email"
                placeholder="Enter a valid email"
                className="text-xs w-full bg-transparent outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-rose-pop text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="email col-span-1">
            <label className="text-xs font-medium text-gray-600">Status</label>
            <div className="border py-1 px-3 rounded-sm">
              <select
                {...register("status")}
                className="text-xs w-full bg-transparent outline-none"
              >
                <option value="Open">Open</option>
                <option
                  value="In Progress"
                  disabled={
                    !ticket.assignee && !ticket.assigneeId
                  }
                >
                  In Progress
                </option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="email col-span-1">
            <label className="label text-xs font-medium text-gray-600 ">
              Assign to
            </label>
            <div className="border py-1.5 px-3 rounded-sm flex items-center">
              <select
                {...register("assigneeId")}
                className="text-xs w-full bg-transparent outline-none"
                defaultValue={ticket.assigneeId || findUserByAssigneeValue(users, ticket.assignee)?.id || ""}
              >
                <option value="">Select user</option>
                {assignableUsers.map((u) => {
                  const displayName = getUserDisplayLabel(u, ASSIGNEE_DISPLAY_FIELD);
                  return (
                    <option key={u.id || displayName} value={u.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        <div className="title">
          <label className="label text-xs font-medium text-gray-600 ">
            Description
          </label>
          <div className="border py-1.5 px-3 rounded-sm flex items-center">
            <textarea
              {...register("description", {
                required: "Description required",
                minLength: {
                  value: 10,
                  message: "Please provide more detail",
                },
              })}
              rows={3}
              className="resize-none text-xs w-full bg-transparent outline-none"
            ></textarea>
          </div>
          {errors.description && (
            <p className="text-rose-pop text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="buttons flex items-center justify-end gap-4">
          <button
            type="button"
            className="border py-1 px-2 text-xs rounded-sm"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="py-1 border border-azure-pop px-2 text-xs rounded-sm bg-azure-pop text-white flex items-center justify-center"
          >
            {mutation.isPending ? <>Saving <Spinner/></> : "Save Changes"}
          </button>
        </div>
      </form>
  );
}