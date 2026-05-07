import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Login() {
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, data.logEmail, data.logPassword);
      navigate("/dashboard");
    } catch (error) {
      // Friendly error messages
      setLoginError("Invalid email or password. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full px-8">
        <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
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
          <input
            {...register("logPassword", { required: "Password is required!" })}
            type="password"
            placeholder="Enter your password"
            className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.logPassword ? "border-red-500" : "border-primary/50"}`}
          />
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
          className="text-white bg-azure-pop py-3 w-full rounded-lg font-semibold mt-4"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
