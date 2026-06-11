import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

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
