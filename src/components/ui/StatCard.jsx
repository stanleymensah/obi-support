

export default function StatCard({value, label}) {
  return (
    <>
      <div className="card border bg-white rounded-xs p-3 space-x-1">
        <h3>{value}</h3>
        <span>{label}</span>
      </div>
    </>
  );
}
