export default function StatCard({ value, label }) {
  return (
    <div className="card border bg-white rounded-xs p-1 md:p-3 space-x-1">
      <h3 className="text-lg font-semibold">{value}</h3>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
