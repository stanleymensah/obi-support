import { useForm } from "react-hook-form";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, query, orderBy, serverTimestamp, setDoc, where } from "firebase/firestore";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";

export default function CreateUserForm({ onClose }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const existingProfileQuery = query(
        collection(db, "users"),
        where("email", "==", newUser.email),
      );
      const existingProfileSnapshot = await getDocs(existingProfileQuery);

      if (!existingProfileSnapshot.empty) {
        throw new Error("A user with this email already exists.");
      }

      const signInMethods = await fetchSignInMethodsForEmail(auth, newUser.email);
      if (signInMethods.length > 0) {
        throw new Error("A user with this email already exists.");
      }

      const apiKey = auth.app.options.apiKey;
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: newUser.email,
            password: newUser.password,
            returnSecureToken: true,
          }),
        },
      );

      const authData = await response.json();

      if (!response.ok) {
        throw new Error(authData?.error?.message || "Failed to create user account.");
      }

      await setDoc(doc(db, "users", authData.localId), {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        createdAt: serverTimestamp(),
        photoURL: "", // Initialize empty profile pic
      });
    },
    onSuccess: () => {
      (async () => {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          queryClient.setQueryData(["users"], users);
        } catch {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }
      })();
      reset();
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error("Error adding user:", error);
      alert(error.message || "Failed to create user profile.");
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

      {/* Password Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Password</label>
        <div className="border py-1.5 px-3 rounded-sm">
          <input
            {...register("password", {
              required: "Password required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
            type="password"
            placeholder="Create a password"
            className="text-xs w-full bg-transparent outline-none"
          />
        </div>
        {errors.password && <p className="text-rose-pop text-[10px]">{errors.password.message}</p>}
      </div>

      {/* Confirm Password Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Confirm Password</label>
        <div className="border py-1.5 px-3 rounded-sm">
          <input
            {...register("confirmPassword", {
              required: "Please confirm the password",
              validate: (value) => value === getValues("password") || "Passwords do not match",
            })}
            type="password"
            placeholder="Confirm the password"
            className="text-xs w-full bg-transparent outline-none"
          />
        </div>
        {errors.confirmPassword && <p className="text-rose-pop text-[10px]">{errors.confirmPassword.message}</p>}
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
