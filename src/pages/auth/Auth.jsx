import Login from "./Login";
import Signup from "./Signup";
import { useState } from "react";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
      <div className="auth flex flex-col gap-4 w-120 border rounded-lg bg-white p-2 h-[95vh] pt-8">
        <div className="header w-full flex items-center justify-center px-6">
          <div className="flex w-full border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`w-1/2 pb-3 font-semibold ${activeTab === "login" ? "border-b-2 border-azure-pop text-azure-pop" : "text-gray-400"}`}
              aria-selected={activeTab === "login"}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`w-1/2 pb-3 font-semibold ${activeTab === "signup" ? "border-b-2 border-azure-pop text-azure-pop" : "text-gray-400"}`}
              aria-selected={activeTab === "signup"}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center p-2">
          {activeTab === "login" ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
}
