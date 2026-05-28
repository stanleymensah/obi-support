import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import { createAdminUser, isValidEmail, validatePassword } from "@/services/adminUserService";
import { useState } from "react";

const ROLES = ["admin", "support", "user"];

export default function CreateUserForm({ onClose }) {
  const queryClient = useQueryClient();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
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

  const password = watch("password");

  // Mutation to create the user via secure Edge Function
  const mutation = useMutation({
    mutationFn: async (formData) => {
      return await createAdminUser({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        avatarFile,
      });
    },
    onSuccess: () => {
      // Refresh users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      
      toast.success("User created successfully.", {
        className: "bg-azure-pop text-white border-azure-pop",
      });
      
      reset();
      handleRemoveAvatar();
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user.", {
        className: "bg-white text-rose-600 border-rose-200",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PNG/JPEG images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar preview + upload */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {avatarPreview ? (
            <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-600">Profile Picture (optional)</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            disabled={mutation.isPending}
            className="text-xs mt-1"
          />
          {avatarPreview && (
            <div className="mt-2">
              <button type="button" onClick={handleRemoveAvatar} className="text-xs text-rose-600">Remove</button>
            </div>
          )}
        </div>
      </div>
      {/* Name Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">First Name</label>
          <div className="border py-1.5 px-3 rounded-sm">
            <input
              {...register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
              type="text"
              placeholder="John"
              className="text-xs w-full bg-transparent outline-none"
              disabled={mutation.isPending}
            />
          </div>
          {errors.firstName && <p className="text-rose-pop text-[10px]">{errors.firstName.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Last Name</label>
          <div className="border py-1.5 px-3 rounded-sm">
            <input
              {...register("lastName", {
                required: "Last name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
              type="text"
              placeholder="Doe"
              className="text-xs w-full bg-transparent outline-none"
              disabled={mutation.isPending}
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
              required: "Email is required",
              validate: (value) => isValidEmail(value) || "Invalid email format",
            })}
            type="email"
            placeholder="john.doe@company.com"
            className="text-xs w-full bg-transparent outline-none"
            disabled={mutation.isPending}
          />
        </div>
        {errors.email && <p className="text-rose-pop text-[10px]">{errors.email.message}</p>}
      </div>

      {/* Temporary Password Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Temporary Password</label>
        <div className="border py-1.5 px-3 rounded-sm">
          <input
            {...register("password", {
              required: "Password is required",
              validate: (value) => validatePassword(value) || true,
            })}
            type="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            className="text-xs w-full bg-transparent outline-none"
            disabled={mutation.isPending}
          />
        </div>
        {errors.password && <p className="text-rose-pop text-[10px]">{errors.password.message}</p>}
        <p className="text-[9px] text-gray-500 mt-1">
          Must contain at least 8 characters, 1 uppercase letter, and 1 number
        </p>
      </div>

      {/* Confirm Password Field */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Confirm Password</label>
        <div className="border py-1.5 px-3 rounded-sm">
          <input
            {...register("confirmPassword", {
              required: "Please confirm the password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            type="password"
            placeholder="Confirm the password"
            className="text-xs w-full bg-transparent outline-none"
            disabled={mutation.isPending}
          />
        </div>
        {errors.confirmPassword && <p className="text-rose-pop text-[10px]">{errors.confirmPassword.message}</p>}
      </div>

      {/* Role Selection */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Assign Role</label>
        <div className="border py-1.5 px-3 rounded-sm">
          <select
            {...register("role", { required: "Role is required" })}
            className="text-xs w-full bg-transparent outline-none"
            disabled={mutation.isPending}
          >
            <option value="">Select a role</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {errors.role && <p className="text-rose-pop text-[10px]">{errors.role.message}</p>}
      </div>

      {/* Buttons */}
      <div className="buttons flex items-center justify-end gap-4 mt-6">
        <button
          type="button"
          className="text-xs text-gray-500 px-4 py-1.5 border rounded-sm hover:bg-gray-50 transition disabled:opacity-50"
          onClick={onClose}
          disabled={mutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="py-1.5 border border-azure-pop px-4 text-xs rounded-sm bg-azure-pop text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {mutation.isPending ? (
            <>
              <Spinner className="w-3 h-3" />
              Creating
            </>
          ) : (
            "Create User"
          )}
        </button>
      </div>
    </form>
  );
}
