import { useState } from "react";
import Login from "./Login";
import SignIn from "./SignIn";

export default function Auth() {
  const [activeForm, setActiveForm] = useState("login");

  const switchPage = (formName) => {
    setActiveForm(formName);
  };

  return (
    <>
      <div className=" w-screen h-screen flex items-center justify-center bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
        <div className="auth flex flex-col gap-4 w-120 border rounded-lg bg-white p-2 h-[95vh] pt-8 ">
          <div className="header w-full flex items-center justify-center">
            <div className="flex gap-5">
              <button
                onClick={() => switchPage("login")}
                className={`font-semibold transition-colors ${
                  activeForm === "login"
                    ? "text-azure-pop border-b-2 border-azure-pop"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => switchPage("signup")}
                className={`font-semibold transition-colors ${
                  activeForm === "signup"
                    ? "text-azure-pop border-b-2 border-azure-pop"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Signup
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center p-2">
            {activeForm === "login" ? <Login /> : <SignIn />}
          </div>
        </div>
      </div>
    </>
  );
}
