export default function Layout() {
  const [dropdown, setDropdown] = useState(false);

  return (
    <>
      <main className="relative w-full grid grid-cols-12 gap-4 p-4 h-screen overflow-hidden bg-linear-to-b from-azure-surface via-azure-pop/10 to-azure-pop/20">
        <div className="col-span-2 h-full">
          <Sidebar />
        </div>

        <div className="col-span-10 h-full flex flex-col gap-2 relative">
          {/* Use the toggle logic correctly here */}
          <Header onProfileClick={() => setDropdown(!dropdown)} />

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>

          {/* Dropdown - Positioned relative to the col-span-10 container */}
          {dropdown && (
            <div className="bg-white border absolute z-50 top-16 right-0 flex flex-col min-w-40 rounded-md shadow-xl py-1 overflow-hidden">
              <button 
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setDropdown(false)}
              >
                <UserRound size={16} /> 
                <span>Profile</span>
              </button>
              
              <hr className="border-gray-100" />
              
              <button 
                className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => {
                  /* handle Logout logic here */
                  setDropdown(false);
                }}
              >
                <LogOut size={16}/> 
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
