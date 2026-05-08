import StatCard from "@/components/ui/statCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function Dashboard() {
  const {
    total,
    open,
    closed,
    high,
    medium,
    statusData,
    priorityData,
    isLoading,
  } = useDashboardStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="container w-full flex flex-col gap-4 h-full">
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
            <StatCard value={total} label="Total" />
            <StatCard value={open} label="Open" />
            <StatCard value={closed} label="Closed" />
            <StatCard value={high} label="High" />
            <StatCard value={medium} label="Medium" />
          </div>
        </div>

        <div className="charts grid grid-cols-2 gap-4">
          <div className="pie-chart flex flex-col gap-2 border-black/10 bg-white shadow-sm inset-shadow-sm inset-shadow-azure-pop/10 rounded-xl py-3 px-4 col-span-1">
            <h4>Tickets By Status</h4>
          </div>
          <div className="pie-chart flex flex-col gap-2 border-black/10 px-4 bg-white shadow-sm inset-shadow-sm inset-shadow-azure-pop/10 rounded-xl py-3 col-span-1">
            <h4>Tickets By Priority</h4>
          </div>
        </div>
      </div>
    </>
  );
}
