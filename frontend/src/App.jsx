import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://127.0.0.1:8000"

function App() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 })
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: ""
  })
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  const fetchData = async (selectedMonth) => {
    const [t, s] = await Promise.all([
      axios.get(`${API}/transactions`, { params: { month: selectedMonth } }),
      axios.get(`${API}/summary`, { params: { month: selectedMonth } })
    ])
    setTransactions(t.data)
    setSummary(s.data)
  }

  useEffect(() => {
    fetchData(month)
  }, [month])

  const handleSubmit = async () => {
    if (!form.amount || !form.category) return
    try {
      await axios.post(`${API}/transactions`, {
        ...form,
        amount: parseFloat(form.amount)
      })
      setForm({ ...form, amount: "", category: "", note: "" })
      fetchData(month)
    } catch (err) {
      console.error("error:", err)
    }
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/transactions/${id}`)
    fetchData(month)
  }



  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Budget Planner</h1>

      {/* Summary */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, background: "#e8f5e9", padding: 16, borderRadius: 8 }}>
          <div>Income</div>
          <strong>{summary.income.toLocaleString()} Ft</strong>
        </div>
        <div style={{ flex: 1, background: "#ffebee", padding: 16, borderRadius: 8 }}>
          <div>Expenses</div>
          <strong>{summary.expenses.toLocaleString()} Ft</strong>
        </div>
        <div style={{ flex: 1, background: "#e3f2fd", padding: 16, borderRadius: 8 }}>
          <div>Balance</div>
          <strong>{summary.balance.toLocaleString()} Ft</strong>
        </div>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            style={{ padding: 8, fontSize: 16 }}
          />
        </div>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          placeholder="Amount (Ft)"
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />
        <input
          placeholder="Category (e.g. food, salary)"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />
        <input
          placeholder="Note (optional)"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
        />
        <button onClick={handleSubmit}>Add Transaction</button>
      </div>

      {/* Transaction list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {transactions.length === 0 && <p>No transactions yet.</p>}
        {transactions.map(t => (
          <div key={t.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: 12, borderRadius: 8,
            background: t.type === "income" ? "#e8f5e9" : "#ffebee"
          }}>
            <div>
              <strong>{t.category}</strong> — {t.amount.toLocaleString()} Ft
              <div style={{ fontSize: 12, color: "#666" }}>{t.date} {t.note && `· ${t.note}`}</div>
            </div>
            <button onClick={() => handleDelete(t.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App