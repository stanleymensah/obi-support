export default function Dashboard() {
  return (
    <>
      <div className="container w-full flex flex-col gap-4 h-full px-2">
        <div className="relative hero h-48">
          <img
            src="/images/banner.jpg"
            alt=""
            className="w-full h-full object-cover rounded-xl border border-black/10 absolute z-0"
          />
          <div className="absolute z-10 text-azure-surface top-2 left-4">
            <h3>Quick Overview</h3>
            <span>This is your overall ticket props</span>
          </div>

          <div className="cards absolute z-10 bottom-3 left-3 right-3 grid grid-cols-5 gap-2">
            <div className="card border border-white/10 bg-white rounded-lg p-3 col-span-1">
              <h3>234</h3>
              <span>Total tickets</span>
            </div>
            <div className="card border border-white/10 bg-white rounded-lg p-3 col-span-1">
              <h3>234</h3>
              <span>Total tickets</span>
            </div>
            <div className="card border border-white/10 bg-white rounded-lg p-3 col-span-1">
              <h3>234</h3>
              <span>Total tickets</span>
            </div>
            <div className="card border border-white/10 bg-white rounded-lg p-3 col-span-1">
              <h3>234</h3>
              <span>Total tickets</span>
            </div>
            <div className="card border border-white/10 bg-white rounded-lg p-3 col-span-1">
              <h3>234</h3>
              <span>Total tickets</span>
            </div>
          </div>
        </div>

        <div className="charts grid grid-cols-2 gap-4">
          <div className="pie-chart flex flex-col gap-2 border-black/10 bg-white shadow-sm inset-shadow-sm inset-shadow-azure-pop/10 rounded-xl py-3 px-4 col-span-1">
          <h3>Tickets By Status</h3>

          
          </div>
          <div className="pie-chart flex flex-col gap-2 border-black/10 px-4 bg-white shadow-sm inset-shadow-sm inset-shadow-azure-pop/10 rounded-xl py-3 col-span-1">
          <h3>Tickets By Status</h3>


          </div>
        </div>
      </div>
    </>
  );
}
