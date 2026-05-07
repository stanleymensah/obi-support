

export default function Tickets() {
  return (
    <>
    <div className="tickets border h-full rounded-xl py-2 px-3 bg-white">
      <div className="top flex items-center justify-between">
        <h3>Support Tickets</h3>

        <div className="grid grid-cols-2 w-1/2">
          <div className="search col-span-2 border py-2 ps-3 rounded-md flex items-center inset-shadow-sm">
            <input type="text" placeholder="Search by title, description, email..." className="text-sm w-full bg-transparent focus:outline-none focus:ring-0 focus:border-transparent" />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
