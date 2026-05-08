import { useAuth } from "@/context/AuthContext";

export default function Header({ showDropdown }) {
  // eslint-disable-next-line no-unused-vars
  const { profile, user } = useAuth();

  return (
    <>
      <header className="h-12 rounded-sm border shadow-sm px-4 flex items-center bg-white justify-end gap-2">
        <div className="user flex items-center gap-1 cursor-pointer" onClick={showDropdown}>
          <div className="img w-7">
            <img
              src="/images/pfp.jpg"
              alt=""
              className="object-cover rounded-full"
            />
          </div>
          <div className="name flex flex-col justify-center">
            <p className="font-medium text-xs">
              {profile ? `${profile.firstName} ${profile.lastName}` : "Guest"}
            </p>
            <span className="text-xs -mt-1">@{profile?.role || "user"}</span>
          </div>
        </div>
      </header>
    </>
  );
}
