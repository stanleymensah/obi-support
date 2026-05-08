import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Priority({data}) {
  return (
    <div className="h-58 w-full">
        <ResponsiveContainer height="100%" width="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeWidth={0.5} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, dy: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, dy: -5, dx: -5 }}
            width={35}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "navy",
              border: "none",
              fontSize: 11,
              fontWeight: "light",
              color: "white"
            }}
            labelStyle={{
              color: "white",
            }}
            itemStyle={{
              color: "white",
            }}
            formatter={(value) => [`${value}`, "Tickets"]}
            cursor={false}
          />
          <Bar
            dataKey="value"
            background={{ fill: "#e6e6e6", radius: [6, 6, 6, 6] }}
            radius={[6, 6, 6, 6]}
            barSize={35}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="oklch(0.5893 0.32 260)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
