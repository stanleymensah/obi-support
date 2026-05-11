import Login from "./Login";

export default function Auth() {
  return (
    <>
      <div className=" w-screen h-screen flex items-center justify-center bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
        <div className="auth flex flex-col gap-4 w-120 border rounded-lg bg-white p-2 h-[95vh] pt-8 ">
          <div className="header w-full flex items-center justify-center">
            <div className="flex gap-5">
              <h2 className="font-semibold text-azure-pop">Login</h2>
            </div>
          </div>

          <div className="flex items-center justify-center p-2">
            <Login />
          </div>
        </div>
      </div>
    </>
  );
}
