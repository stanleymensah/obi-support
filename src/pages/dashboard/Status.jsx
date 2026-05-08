import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

// const data = [
//   { name: "Scarlett Evans", value: 1, color: "#9EF56B" },
//   { name: "Daniel Baker", value: 1, color: "#8E94F2" },
//   { name: "Chloe Foster", value: 1, color: "#C86DF1" },
//   { name: "Avery Nelson", value: 1, color: "#F7A431" },
//   { name: "Oliver Roberts", value: 1, color: "#6BB7F5" },
//   { name: "Christian Brooks", value: 1, color: "#F5E942" },
// ];

export default function Status({data}) {
  return (
    <div className="w-full h-58">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="30%" // Moves chart to the left to make room for legend
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={8} // Creates the gaps between segments
            cornerRadius={10} // Creates the rounded ends
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingLeft: "20px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
