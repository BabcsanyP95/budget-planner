import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

function Chart({ summary }) {
  const data = [
    {
      name: "This Month",
      Income: summary.income,
      Expenses: summary.expenses,
    }
  ]

  return (
    <div style={{ width: "100%", height: 200, marginBottom: 28 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="40%">
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 13 }} />
          <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: "#1a2234", border: "1px solid #2a3649", borderRadius: 8 }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 13 }} />
          <Bar dataKey="Income" fill="#34d399" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart