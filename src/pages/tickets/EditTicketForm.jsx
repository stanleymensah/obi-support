import { useForm } from "react-hook-form";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export default function EditTicketForm({ onClose, ticket }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: ticket.title || "",
      email: ticket?.email || "",
      assignee: ticket.assignee || "",
      description: ticket.description || "",
      status: ticket.status || "Open",
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      // Points to the specific document using the ID
      const ticketRef = doc(db, "tickets", ticket.id);
      return await updateDoc(ticketRef, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets", user?.uid] });
      if (onClose) onClose();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="title">
          <label className="label text-sm font-medium text-gray-600 ">
            Title
          </label>
          <div className="border py-2 px-3 rounded-md flex items-center">
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
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
          {errors.title && (
            <p className="text-rose-pop text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="email-ems grid grid-cols-3 gap-2">
          <div className="email col-span-1">
            <label className="label text-sm font-medium text-gray-600 ">
              Email
            </label>
            <div className="border py-2 px-3 rounded-md flex items-center">
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
                className="text-sm w-full bg-transparent outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-rose-pop text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="email col-span-1">
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div className="border py-2 px-3 rounded-md">
              <select
                {...register("status")}
                className="text-sm w-full bg-transparent outline-none"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="email col-span-1">
            <label className="label text-sm font-medium text-gray-600 ">
              Assign to
            </label>
            <div className="border py-2 px-3 rounded-md flex items-center">
              <input
                {...register("assignee")}
                type="text"
                placeholder="Assignee name"
                className="text-sm w-full bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="title">
          <label className="label text-sm font-medium text-gray-600 ">
            Description
          </label>
          <div className="border py-2 px-3 rounded-md flex items-center">
            <textarea
              {...register("description", {
                required: "Description required",
                minLength: {
                  value: 10,
                  message: "Please provide more detail",
                },
              })}
              rows={3}
              className="resize-none text-sm w-full bg-transparent outline-none"
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
            className="border py-1 px-2 text-sm rounded-sm"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="py-1 border px-2 text-sm rounded-sm bg-azure-pop text-white"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
}
