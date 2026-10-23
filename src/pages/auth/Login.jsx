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

export default function Login() {
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setLoginError("");
    try {
      const supabaseKey = requireSupabaseKey();
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          email: data.logEmail,
          password: data.logPassword,
        }),
      });

      const authData = await readResponse(response);
      if (!response.ok || !authData?.user) {
        throw new Error(
          authData?.error_description ||
          authData?.msg ||
          `Login failed (${response.status}).`,
        );
      }

      localStorage.setItem("supabase_access_token", authData.access_token || "");
      localStorage.setItem("supabase_user", JSON.stringify(authData.user));
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/dashboard");
    } catch (error) {
      // Friendly error messages
      setLoginError("Invalid email or password. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full px-8">
        <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        <p className="text-xs text-gray-600">
          Enter to get unlimited access to data & information
        </p>
</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 text-xs"
      >
        <div className="flex flex-col gap-2">
          <label className=" font-semibold">Email</label>
          <input
            {...register("logEmail", { required: "Email is required" })}
            type="email"
            placeholder="Enter your email address"
            className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.logEmail ? "border-red-500" : "border-primary/50"}`}
          />
        </div>
        {errors.logEmail && (
          <span className="font-medium text-red-400">
            {errors.logEmail.message}
          </span>
        )}

        <div className="flex flex-col gap-2">
          <label className=" font-semibold">Password</label>
          <div className="relative">
            <input
              {...register("logPassword", { required: "Password is required!" })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`p-3 pr-10 w-full border rounded-lg focus:outline-none focus:border-primary ${errors.logPassword ? "border-red-500" : "border-primary/50"}`}
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
        </div>
        {errors.logPassword && (
          <span className="font-medium text-red-400">
            {errors.logPassword.message}
          </span>
        )}
        {loginError && (
          <span className="font-medium text-red-400">{loginError}</span>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-azure-pop py-3 w-full rounded-lg font-semibold mt-4 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              Logging in <Spinner />
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
