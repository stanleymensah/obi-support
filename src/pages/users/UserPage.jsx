import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";

export default function UserPage() {
  // eslint-disable-next-line no-unused-vars
  const { profile, user } = useAuth();

  return (
    <>
      <div className="tickets border h-full rounded-md bg-white flex flex-col gap-4">
        <div className="top flex items-center justify-between py-2 px-4 text-white bg-azure-pop rounded-t-sm">
          <h4>Profile</h4>
        </div>

        <div className="body px-4 flex flex-col gap-5">
          <div className="details flex items-center w-full gap-4">
            <div className="w-24">
              <img
                src="/images/pfp.jpg"
                alt=""
                className="object-cover rounded-full"
              />
            </div>
            <div className="names flex flex-col">
              <div className="flex items-center gap-2">
                <h3>
                  {profile
                    ? `${profile?.firstName} ${profile?.lastName}`
                    : "Guest"}
                </h3> {"-"}
                <span className="capitalize bg-azure-pop text-white text-xs px-1 py-0.5 text-center rounded-full"> {profile ? `${profile?.role}` : "User"}</span>
              </div>
              <span>{profile ? `${profile?.email}` : "Null"}</span>
              <span>
                Joined:{formatDate(profile?.createdAt)}
              </span>
            </div>
          </div>
          <div className="tickets flex flex-col gap-2">
            <div className="border-b border-black/10 pb-1">
              <h4>Tickets</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
