import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"

const formatFt = (value) => `${value.toLocaleString()} Ft`

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a2234",
        border: "1px solid #2a3649",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13
      }}>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.fill, marginBottom: 4 }}>
            {p.name}: <strong>{formatFt(p.value)}</strong>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function Chart({ summary }) {
  const data = [
    { name: "Income", value: summary.income, color: "#34d399" },
    { name: "Expenses", value: summary.expenses, color: "#f87171" },
    { name: "Balance", value: summary.balance, color: "#60a5fa" },
  ]

  return (
    <div style={{ width: "100%", height: 220, marginBottom: 28 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="35%" barGap={8}>
          <XAxis
            dataKey="name"
            stroke="none"
            tick={{ fill: "#94a3b8", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="none"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatFt}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart