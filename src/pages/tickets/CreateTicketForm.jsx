import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import { useUsers } from "@/hooks/useUsers";
import { ASSIGNEE_DISPLAY_FIELD, buildAssigneePayload, getUserDisplayLabel, findUserByAssigneeValue } from "@/lib/assignee";
import { supabase } from "@/utils/supabase";

export default function CreateTicketForm({ onClose }) {
  const { user, profile } = useAuth();
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
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      email: "",
      priority: "",
      assigneeId: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (newTicket) => {
      const createdBy = user?.uid || user?.id;
      if (!createdBy) {
        throw new Error("Missing authenticated user id.");
      }

      const payload = {
        title: newTicket.title,
        email: newTicket.email,
        priority: newTicket.priority,
        assignee: newTicket.assigneeId || null,
        description: newTicket.description,
        created_by: createdBy,
        status: newTicket.assigneeId ? "Assigned" : "Open",
      };

      const { data, error } = await supabase.from("tickets").insert(payload);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket created successfully.", {
        className: "bg-azure-pop text-white border-azure-pop",
      });
      reset();
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error("Error adding ticket:", error);
      toast.error(error.message || "Failed to create ticket.", {
        className: "bg-white text-rose-600 border-rose-200",
      });
    },
  });

  const onSubmit = (data) => {
    const selectedUser = findUserByAssigneeValue(users, data.assigneeId);
    const payload = {
      ...data,
      ...buildAssigneePayload(selectedUser, ASSIGNEE_DISPLAY_FIELD),
    };

    mutation.mutate(payload);
  };

  return (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                <p className="text-rose-pop text-xs mt-1">
                  {errors.title.message}
                </p>
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
                <label className="label text-xs font-medium text-gray-600 ">
                  Priority
                </label>
                <div className="border py-1.5 px-3 rounded-sm flex items-center">
                  <select
                    {...register("priority", { required: true })}
                    className="text-xs w-full bg-transparent outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Select priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {profile?.role !== "user" && (
                <div className="email col-span-1">
                  <label className="label text-xs font-medium text-gray-600 ">
                    Assign to
                  </label>
                  <div className="border py-1.5 px-3 rounded-sm flex items-center">
                    <select
                      {...register("assigneeId")}
                      className="text-xs w-full bg-transparent outline-none"
                      defaultValue=""
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
              )}
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
                {mutation.isPending ? <>Creating <Spinner /> </> : "Create"}
              </button>
            </div>
          </form>
  );
}
