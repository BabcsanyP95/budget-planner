import { useState, useEffect } from "react"
import axios from "axios"
import Chart from "./Chart"

const API = "https://budget-planner-api-tojd.onrender.com"

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
    try {
      const [t, s] = await Promise.all([
        axios.get(`https://budget-planner-api-tojd.onrender.com/transactions`, { params: { month: selectedMonth } }),
        axios.get(`https://budget-planner-api-tojd.onrender.com/summary`, { params: { month: selectedMonth } })
      ])
      setTransactions(t.data)
      setSummary(s.data)
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }

  useEffect(() => {
    fetchData(month)
  }, [month])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || !form.category) return
    try {
      await axios.post(`${API}/transactions`, {
        ...form,
        amount: parseFloat(form.amount)
      })
      setForm({ ...form, amount: "", category: "", note: "" })
      fetchData(month)
    } catch (err) {
      console.error("Error saving transaction:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/transactions/${id}`)
      fetchData(month)
    } catch (err) {
      console.error("Error deleting transaction:", err)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* Header & Month Selector */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Budget Planner</h1>
            <p style={styles.subtitle}>Track your income and expenses seamlessly</p>
          </div>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            style={styles.monthInput}
          />
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={{ ...styles.card, background: "#064e3b", borderColor: "#047857" }}>
            <span style={{ ...styles.cardLabel, color: "#6ee7b7" }}>Income</span>
            <strong style={{ ...styles.cardValue, color: "#a7f3d0" }}>
              {summary.income.toLocaleString()} Ft
            </strong>
          </div>
          <div style={{ ...styles.card, background: "#7f1d1d", borderColor: "#991b1b" }}>
            <span style={{ ...styles.cardLabel, color: "#fca5a5" }}>Expenses</span>
            <strong style={{ ...styles.cardValue, color: "#fecaca" }}>
              {summary.expenses.toLocaleString()} Ft
            </strong>
          </div>
          <div style={{ ...styles.card, background: "#1e3a8a", borderColor: "#1d4ed8" }}>
            <span style={{ ...styles.cardLabel, color: "#93c5fd" }}>Balance</span>
            <strong style={{ ...styles.cardValue, color: "#bfdbfe" }}>
              {summary.balance.toLocaleString()} Ft
            </strong>
          </div>
        </div>

        <Chart summary={summary} />

        {/* Add Transaction Form */}
        <form onSubmit={handleSubmit} style={styles.formCard}>
          <h3 style={styles.formTitle}>New Transaction</h3>
          <div style={styles.formGrid}>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
              style={styles.input}
            >
              <option value="expense" style={{ background: "#121826" }}>Expense</option>
              <option value="income" style={{ background: "#121826" }}>Income</option>
            </select>
            <input
              placeholder="Amount (Ft)"
              type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Category (e.g. food, salary)"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              style={styles.input}
            />
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Note (optional)"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              style={{ ...styles.input, gridColumn: "1 / -1" }}
            />
          </div>
          <button type="submit" style={styles.button}>Add Transaction</button>
        </form>

        {/* Transaction List */}
        <div>
          <h3 style={styles.sectionTitle}>Transaction History</h3>
          <div style={styles.transactionList}>
            {transactions.length === 0 && (
              <p style={styles.emptyText}>No transactions recorded for this month.</p>
            )}
            {transactions.map(t => (
              <div key={t.id} style={styles.transactionItem}>
                <div style={styles.transactionInfo}>
                  <div style={{
                    ...styles.badge,
                    background: t.type === "income" ? "#064e3b" : "#7f1d1d",
                    color: t.type === "income" ? "#6ee7b7" : "#fca5a5"
                  }}>
                    {t.type === "income" ? "Income" : "Expense"}
                  </div>
                  <div>
                    <strong style={styles.categoryText}>{t.category}</strong>
                    <div style={styles.metaText}>{t.date} {t.note && `· ${t.note}`}</div>
                  </div>
                </div>
                <div style={styles.transactionRight}>
                  <span style={{
                    ...styles.amountText,
                    color: t.type === "income" ? "#34d399" : "#f87171"
                  }}>
                    {t.type === "income" ? "+" : "-"}{t.amount.toLocaleString()} Ft
                  </span>
                  <button 
                    onClick={() => handleDelete(t.id)} 
                    style={styles.deleteButton}
                    title="Delete transaction"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// Dark Mode Stylesheet Object
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#090d16",
    padding: "32px 16px",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    color: "#f1f5f9"
  },
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    background: "#121826",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    border: "1px solid #1e293b"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    gap: "16px",
    flexWrap: "wrap"
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#f8fafc"
  },
  subtitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0
  },
  monthInput: {
    padding: "8px 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#1a2234",
    color: "#f1f5f9",
    outline: "none",
    cursor: "pointer"
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "28px"
  },
  card: {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid",
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  cardLabel: {
    fontSize: "13px",
    fontWeight: "500"
  },
  cardValue: {
    fontSize: "20px",
    fontWeight: "700"
  },
  formCard: {
    background: "#1a2234",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #2a3649",
    marginBottom: "32px"
  },
  formTitle: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 16px 0",
    color: "#e2e8f0"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px"
  },
  input: {
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#121826",
    color: "#f1f5f9",
    outline: "none",
    width: "100%",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 12px 0",
    color: "#e2e8f0"
  },
  transactionList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  transactionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderRadius: "10px",
    background: "#1a2234",
    border: "1px solid #2a3649"
  },
  transactionInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  badge: {
    fontSize: "11px",
    fontWeight: "600",
    padding: "4px 8px",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  categoryText: {
    fontSize: "14px",
    color: "#f1f5f9",
    display: "block",
    marginBottom: "2px"
  },
  metaText: {
    fontSize: "12px",
    color: "#94a3b8"
  },
  transactionRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  amountText: {
    fontSize: "15px",
    fontWeight: "600"
  },
  deleteButton: {
    background: "none",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px",
    borderRadius: "4px"
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
    padding: "24px 0",
    margin: 0
  }
}

export default App