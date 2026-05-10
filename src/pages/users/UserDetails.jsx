import { formatDate } from "@/lib/utils";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function UserDetails({ user }) {
  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-azure-pop/10 rounded-full flex items-center justify-center text-azure-pop border border-azure-pop/20">
          <User size={32} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-gray-800">
            {user.firstName} {user.lastName}
          </h3>
          <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
            user.role === 'admin' 
              ? 'bg-azure-pop text-white border-azure-pop' 
              : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}>
            {user.role}
          </span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
            <Mail size={12} /> Email Address
          </h4>
          <span className="text-sm text-gray-700 font-medium">{user.email}</span>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
            <Calendar size={12} /> Date Joined
          </h4>
          <span className="text-sm text-gray-700 font-medium">{formatDate(user.createdAt)}</span>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
            <Shield size={12} /> Account Permissions
          </h4>
          <span className="text-xs text-gray-600 leading-relaxed">
            {user.role === 'admin' 
              ? "Full access to system settings, user management, and all support tickets." 
              : "Standard access to view and create personal support tickets."}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-[10px] font-bold uppercase text-gray-400">User ID</h4>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
            {user.id}
          </span>
        </div>
      </div>
    </div>
  );
}
