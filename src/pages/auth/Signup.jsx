import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import { requireSupabaseKey, supabaseUrl } from "@/config/supabase";

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Supabase returned an invalid response (${response.status}).`);
  }
}

export default function Signup() {
  const [signupMessage, setSignupMessage] = useState("");
  const [signupError, setSignupError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setSignupMessage("");
    setSignupError("");

    try {
      const supabaseKey = requireSupabaseKey();
      const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: "user",
          },
        }),
      });

      const authData = await readResponse(response);
      if (!response.ok) {
        throw new Error(
          authData?.msg ||
          authData?.error_description ||
          `Signup failed (${response.status}).`,
        );
      }

      if (authData?.session && authData?.user) {
        localStorage.setItem("supabase_access_token", authData.access_token || "");
        localStorage.setItem("supabase_user", JSON.stringify(authData.user));
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/dashboard");
        return;
      }

      setSignupMessage("Your account has been created. Check your email to confirm your account.");
    } catch (error) {
      setSignupError(error.message || "Unable to create your account. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-xs text-gray-600">
          Sign up to get access to data & information
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="signup-first-name">First name</label>
            <input
              id="signup-first-name"
              {...register("firstName", { required: "First name is required" })}
              type="text"
              placeholder="First name"
              className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.firstName ? "border-red-500" : "border-primary/50"}`}
            />
            {errors.firstName && <span className="font-medium text-red-400">{errors.firstName.message}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold" htmlFor="signup-last-name">Last name</label>
            <input
              id="signup-last-name"
              {...register("lastName", { required: "Last name is required" })}
              type="text"
              placeholder="Last name"
              className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.lastName ? "border-red-500" : "border-primary/50"}`}
            />
            {errors.lastName && <span className="font-medium text-red-400">{errors.lastName.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Enter your email address"
            className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.email ? "border-red-500" : "border-primary/50"}`}
          />
          {errors.email && <span className="font-medium text-red-400">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="signup-password">Password</label>
          <div className="relative">
            <input
              id="signup-password"
              {...register("password", {
                required: "Password is required!",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className={`p-3 pr-10 w-full border rounded-lg focus:outline-none focus:border-primary ${errors.password ? "border-red-500" : "border-primary/50"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <span className="font-medium text-red-400">{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
            type="password"
            placeholder="Confirm your password"
            className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.confirmPassword ? "border-red-500" : "border-primary/50"}`}
          />
          {errors.confirmPassword && (
            <span className="font-medium text-red-400">{errors.confirmPassword.message}</span>
          )}
        </div>

        {signupError && <span className="font-medium text-red-400">{signupError}</span>}
        {signupMessage && <span className="font-medium text-green-600">{signupMessage}</span>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-azure-pop py-3 w-full rounded-lg font-semibold mt-4 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>Creating account <Spinner /></>
          ) : (
            "Sign up"
          )}
        </button>
      </form>
    </div>
  );
}
