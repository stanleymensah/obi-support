import StatCard from "@/components/ui/StatCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import Status from "./Status";
import Priority from "./Priority";
import Spinner from "@/components/ui/spinner";

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

  if (isLoading) return <div className="w-full flex items-center justify-center">Loading <Spinner /></div>;

  return (
    <div className="w-full min-w-0 gap-2 bg-sky-100 p-2 flex flex-col h-full">
      <div className="relative hero h-60 md:h-48 w-full">
        <img
          src="/images/banner.jpg"
          alt=""
          className="w-full h-full object-cover border border-black/10 absolute z-0 rounded-sm"
        />
        <div className="absolute z-10 text-azure-surface top-2 left-4">
          <h3>Quick Overview</h3>
          <span>This is your overall ticket props</span>
        </div>

        <div className="cards absolute z-10 bottom-3 left-3 right-3 min-w-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <StatCard value={total} label="Total" />
          <StatCard value={open} label="Open" />
          <StatCard value={closed} label="Closed" />
          <StatCard value={high} label="High" />
          <StatCard value={medium} label="Medium" />
        </div>
      </div>

      <div className="charts flex flex-col md:grid md:grid-cols-2 gap-2 flex-1 w-full">
        <div className="pie-chart flex h-[calc(100%-4rem)] flex-col justify-between gap-2 border-black/10 bg-white shadow-sm rounded-sm py-3 px-4 col-span-1">
          <div className="w-full">
            <h4>By Priority</h4>
          </div>
          <div className="status flex-1 min-h-0">
            <Status data={priorityData} />
          </div>
        </div>

        <div className="pie-chart flex h-[calc(100%-4rem)] flex-col justify-between gap-2 border-black/10 px-4 bg-white shadow-sm rounded-sm py-3 col-span-1">
          <div>
            <h4>By Status</h4>
          </div>
          <div className="priority flex-1 min-h-0">
            <Priority data={statusData} />
          </div>
        </div>
      </div>
    </div>
  );
}
