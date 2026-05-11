import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";

export default function UserPage() {
  // eslint-disable-next-line no-unused-vars
  const { profile, user } = useAuth();

  return (
    <>
      <div className="tickets border h-full rounded-md bg-white flex flex-col gap-2">
        <div className="top flex items-center justify-between py-2 px-4 text-white bg-azure-pop rounded-t-sm">
          <h4>Profile</h4>
        </div>

        <div className="body px-4 flex flex-col gap-5">
          <div className="details flex items-center w-full gap-4">
            <div className="w-14">
              <img
                src="/images/pfp.jpg"
                alt=""
                className="object-cover rounded-full"
              />
            </div>
            <div className="names flex flex-col">
              <div className="flex items-center gap-2">
                <h4>
                  {profile
                    ? `${profile?.firstName} ${profile?.lastName}`
                    : "Guest"}
                </h4> {"-"}
                <span className="uppercase bg-azure-pop text-white text-[10px] px-1 py-0.5 text-center rounded-full"> {profile ? `${profile?.role}` : "User"}</span>
              </div>
              <span className="text-[11px]">{profile ? `${profile?.email}` : "Null"}</span>
              <span className="text-[11px]">
                Joined:{formatDate(profile?.createdAt)}
              </span>
            </div>
          </div>
          <div className="tickets flex flex-col gap-2">
            <div className="border-b border-black/10 pb-1">
              <h4>Edit Profile</h4>
            </div>

            <div className="details">
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
