import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Plus } from "lucide-react";

export default function Header({dowhat}) {

  // eslint-disable-next-line no-unused-vars
  const {profile, user} = useAuth();

  return (
    <>
    <header className="h-16 rounded-md border shadow-sm mx-2 px-4 flex items-center bg-white justify-end gap-2">

    <div className="create">
      <button onClick={dowhat} className="border rounded-full p-1.5 text-gray-400 shadow-sm">
        <Plus />
      </button>
    </div>
        
        <Link className="user flex items-center gap-2">
          <div className="img w-10">
            <img src="/images/pfp.jpg" alt="" className="object-cover rounded-full"/>
          </div>
          <div className="name flex flex-col leading-3 justify-center gap-1">
            <text className="font-medium">{profile ? `${profile.firstName} ${profile.lastName}` : "Guest"}</text>
            <span className="text-xs">@{profile?.role || "user"}</span>
          </div>
        </Link>
    </header>
    </>
  )
}
