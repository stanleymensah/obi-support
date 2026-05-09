import { Link } from "react-router-dom";
import {  AlertCircle, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-linear-to-b from-azure-surface to-azure-pop/10 p-4 text-center">
      {/* Visual Element */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-azure-pop blur-3xl opacity-20 animate-pulse"></div>
        <h1 className="relative text-9xl font-black text-azure-pop tracking-tighter">
          404
        </h1>
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Lost in the system?
        </h2>
        <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
          The page you are looking for doesn't exist or has been moved to a different department.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 bg-azure-pop text-white px-6 py-3 rounded-sm font-semibold shadow-lg shadow-azure-pop/30"
        >
          <ChevronLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Decorative ID */}
      <div className="mt-20 opacity-50 flex items-center gap-2 text-gray-400">
        <AlertCircle size={14} />
        <span className="text-[10px] font-mono uppercase tracking-widest">
          Error_Code: PAGE_NOT_FOUND_0x404
        </span>
      </div>
    </div>
  );
}
