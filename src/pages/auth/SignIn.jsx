import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      clearErrors("email");

      const email = data.email.trim().toLowerCase();
      const existingMethods = await fetchSignInMethodsForEmail(auth, email);

      if (existingMethods.length > 0) {
        setError("email", {
          type: "validate",
          message: "This email is already registered.",
        });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        data.password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        role: "user",
        createdAt: new Date(),
      });

      console.log("Profile created Successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Join us!</h1>
        <p className="text-xs text-gray-600">
          Register and get unlimited access to data & information
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 text-xs"
      >
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2">
            <label className=" font-semibold">First Name</label>
            <input
              {...register("firstName", {
                required: "firstName is required!",
                minLength: {
                  value: 3,
                  message: "firstName must be at least 3 characters",
                },
              })}
              type="text"
              placeholder="Enter a firstName"
              className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.firstName ? "border-red-500" : "border-primary/50"}`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className=" font-semibold">Last Name</label>
            <input
              {...register("lastName", {
                required: "lastName is required!",
                minLength: {
                  value: 3,
                  message: "lastName must be at least 3 characters",
                },
              })}
              type="text"
              placeholder="Enter a lastName"
              className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.lastName ? "border-red-500" : "border-primary/50"}`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold">Email</label>
          <input
            {...register("email", {
              required: "Email is required!",
              minLength: {
                value: 8,
                message: "Email must be at least 8 characters",
              },
            })}
            type="email"
            placeholder="Enter your email address"
            className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.email ? "border-red-500" : "border-primary/50"}`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold">Password</label>
          <input
            {...register("password", {
              required: "Password is required!",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type="password"
            placeholder="Enter your password"
            className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.password ? "border-red-500" : "border-primary/50"}`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className=" font-semibold">Confirm Password</label>
          <input
            {...register("confirmPassword", {
              required: "Confirm Password!",
              validate: (value) => value === getValues("password") || "Passwords do not match!",
            })}
            type="password"
            placeholder="Confirm your password"
            className={`p-3 border rounded-lg focus:outline-none focus:border-primary ${errors.confirmPassword ? "border-red-500" : "border-primary/50"}`}
          />
        </div>

        {(errors.confirmPassword || errors.password) && (
          <p className="text-red-500 font-medium">
            {errors.confirmPassword?.message || errors.password?.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-azure-pop py-3 w-full rounded-lg font-semibold mt-2"
        >
          {isSubmitting ? "Creating Account" : "Sign up"}
        </button>
      </form>
    </div>
  );
}
