import { useForm } from "react-hook-form";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateUserForm({ onClose }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
    },
  });

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      // We use addDoc if we don't have a UID yet, 
      // or setDoc if you are linking to an Auth account.
      return await addDoc(collection(db, "users"), {
        ...newUser,
        createdAt: serverTimestamp(),
        photoURL: "", // Initialize empty profile pic
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error("Error adding user:", error);
      alert("Failed to create user profile.");
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
          <div className="border py-1.5 px-3 rounded-sm">
            <input
              {...register("firstName", { required: "Required" })}
              type="text"
              placeholder="John"
              className="text-xs w-full bg-transparent outline-none"
            />
          </div>
          {errors.firstName && <p className="text-rose-pop text-[10px]">{errors.firstName.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Last Name</label>
          <div className="border py-1.5 px-3 rounded-sm">
            <input
              {...register("lastName", { required: "Required" })}
              type="text"
              placeholder="Doe"
              className="text-xs w-full bg-transparent outline-none"
            />
          </div>
          {errors.lastName && <p className="text-rose-pop text-[10px]">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Email Address</label>
        <div className="border py-1.5 px-3 rounded-sm">
          <input
            {...register("email", { 
              required: "Email required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" }
            })}
            type="email"
            placeholder="john.doe@company.com"
            className="text-xs w-full bg-transparent outline-none"
          />
        </div>
        {errors.email && <p className="text-rose-pop text-[10px]">{errors.email.message}</p>}
      </div>

      {/* Role Selection */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Assign Role</label>
        <div className="border py-1.5 px-3 rounded-sm">
          <select
            {...register("role", { required: true })}
            className="text-xs w-full bg-transparent outline-none"
          >
            <option value="user">Standard User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="buttons flex items-center justify-end gap-4 mt-2">
        <button
          type="button"
          className="text-xs text-gray-500 hover:underline"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="py-1.5 border px-4 text-xs rounded-sm bg-azure-pop text-white font-semibold disabled:opacity-50"
        >
          {mutation.isPending ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}
