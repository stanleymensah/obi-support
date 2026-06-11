import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import { createAdminUser, isValidEmail, validatePassword } from "@/services/adminUserService";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { UserCircle2 } from "lucide-react";

const ROLES = ["admin", "support", "user"];

const ROLE_DESCRIPTIONS = {
  admin: "Full access — manage users, tickets, and settings",
  support: "Can view and action support tickets",
  user: "Can submit and track their own tickets",
};

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
      {error && <p className="text-rose-pop text-[10px]">{error}</p>}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <div className="border rounded-sm py-1.5 px-3 focus-within:ring-1 focus-within:ring-azure-pop/40 transition">
      <input
        className={`text-xs w-full bg-transparent outline-none placeholder:text-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
}

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
  const selectedRole = watch("role");

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

  const onSubmit = (data) => mutation.mutate(data);

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

      {/* ── Avatar + Name ── */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <label className="relative group cursor-pointer shrink-0">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center transition group-hover:ring-azure-pop/50">
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 className="w-7 h-7 text-gray-300" />
            )}
          </div>
          {/* overlay on hover */}
          <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="text-[9px] font-medium text-white leading-tight text-center">Change</span>
          </div>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            disabled={mutation.isPending}
            className="hidden"
          />
        </label>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 leading-none">Profile picture</p>
          <p className="text-[10px] text-gray-400 mt-1">PNG or JPEG, max 2 MB</p>
          {avatarPreview && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="text-[10px] text-rose-500 hover:text-rose-600 mt-1.5 transition"
            >
              Remove photo
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* ── Identity ── */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Identity</p>

        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" error={errors.firstName?.message}>
            <Input
              {...register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
              placeholder="John"
              disabled={mutation.isPending}
            />
          </Field>

          <Field label="Last name" error={errors.lastName?.message}>
            <Input
              {...register("lastName", {
                required: "Last name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
                maxLength: { value: 50, message: "Maximum 50 characters" },
              })}
              placeholder="Doe"
              disabled={mutation.isPending}
            />
          </Field>
        </div>

        <Field label="Email address" error={errors.email?.message}>
          <Input
            {...register("email", {
              required: "Email is required",
              validate: (value) => isValidEmail(value) || "Invalid email format",
            })}
            type="email"
            placeholder="john.doe@company.com"
            disabled={mutation.isPending}
          />
        </Field>
      </div>

      <Separator />

      {/* ── Credentials ── */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Credentials</p>

        <Field label="Temporary password" error={errors.password?.message}>
          <Input
            {...register("password", {
              required: "Password is required",
              validate: (value) => validatePassword(value) || true,
            })}
            type="password"
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            disabled={mutation.isPending}
          />
          <p className="text-[9px] text-gray-400 -mt-0.5">
            At least 8 characters, one uppercase letter, one number
          </p>
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword?.message}>
          <Input
            {...register("confirmPassword", {
              required: "Please confirm the password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            type="password"
            placeholder="Repeat the password"
            disabled={mutation.isPending}
          />
        </Field>
      </div>

      <Separator />

      {/* ── Role ── */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Role</p>

        <div className="flex gap-2">
          {ROLES.map((role) => (
            <label
              key={role}
              className={`flex-1 border rounded-sm px-3 py-2 cursor-pointer transition select-none ${
                selectedRole === role
                  ? "border-azure-pop bg-azure-pop/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                value={role}
                {...register("role", { required: "Role is required" })}
                className="hidden"
                disabled={mutation.isPending}
              />
              <span
                className={`block text-xs font-medium capitalize ${
                  selectedRole === role ? "text-azure-pop" : "text-gray-700"
                }`}
              >
                {role}
              </span>
              <span className="block text-[9px] text-gray-400 mt-0.5 leading-snug">
                {ROLE_DESCRIPTIONS[role]}
              </span>
            </label>
          ))}
        </div>
        {errors.role && <p className="text-rose-pop text-[10px]">{errors.role.message}</p>}
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={mutation.isPending}
          className="text-xs text-gray-500 px-4 py-1.5 border rounded-sm hover:bg-gray-50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="py-1.5 px-4 text-xs rounded-sm bg-azure-pop border border-azure-pop text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition hover:opacity-90"
        >
          {mutation.isPending ? (
            <>
              <Spinner className="w-3 h-3" />
              Creating
            </>
          ) : (
            "Create user"
          )}
        </button>
      </div>
    </form>
  );
}