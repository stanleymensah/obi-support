import { useForm } from "react-hook-form";
import { db } from "@/lib/firebase";
import { doc, updateDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";

export default function EditUserForm({ onClose, userToEdit }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: userToEdit?.firstName || "",
      lastName: userToEdit?.lastName || "",
      email: userToEdit?.email || "",
      role: userToEdit?.role || "user",
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      // Points to the specific USER document using their ID
      const userRef = doc(db, "users", userToEdit.id);
      return await updateDoc(userRef, updatedData);
    },
    onSuccess: () => {
      (async () => {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          queryClient.setQueryData(["users"], users);
        } catch (e) {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          console.log(e.message)
        }
      })();
      if (onClose) onClose();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Name Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">First Name</label>
          <div className="border py-1.5 px-3 rounded-sm flex items-center">
            <input
              {...register("firstName", { required: "First name is required" })}
              type="text"
              className="text-xs w-full bg-transparent outline-none"
            />
          </div>
          {errors.firstName && (
            <p className="text-rose-pop text-[10px] mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Last Name</label>
          <div className="border py-1.5 px-3 rounded-sm flex items-center">
            <input
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              className="text-xs w-full bg-transparent outline-none"
            />
          </div>
          {errors.lastName && (
            <p className="text-rose-pop text-[10px] mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Email Address</label>
        <div className="border py-1.5 px-3 rounded-sm flex items-center bg-gray-50">
          <input
            {...register("email", { 
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
            })}
            type="email"
            readOnly // Usually best to prevent email edits here to avoid Auth mismatch
            className="text-xs w-full bg-transparent outline-none text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Role Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">System Role</label>
        <div className="border py-1.5 px-3 rounded-sm flex items-center">
          <select
            {...register("role")}
            className="text-xs w-full bg-transparent outline-none"
          >
            <option value="admin">Administrator</option>
            <option value="support">Support</option>
            <option value="user">Standard User</option>
          </select>
        </div>
      </div>

      <div className="buttons flex items-center justify-end gap-4 mt-2">
        <button
          type="button"
          className="border py-1 px-3 text-xs rounded-sm hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="py-1 border border-azure-pop px-3 text-xs rounded-sm bg-azure-pop text-white font-semibold disabled:opacity-50 flex items-center justify-center"
        >
          {mutation.isPending ? <>Updating <Spinner/></> : "Update User"}
        </button>
      </div>
    </form>
  );
}
