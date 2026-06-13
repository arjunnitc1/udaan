"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: number;
};

const INCOME_CATEGORIES = ["Sales", "Services", "Orders", "Other Income"];
const EXPENSE_CATEGORIES = ["Materials", "Transport", "Phone/Data", "Equipment", "Other Expense"];
const STORAGE_KEY = "udaan_transactions";

function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveTransactions(txns: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function AppNav() {
  const router = useRouter();
  const { logout } = useAuth();
  return (
    <nav className="app-nav">
      <div className="brand" onClick={() => router.push("/dashboard")}>
        <div className="kite" />
        <h1 className="serif">Udaan<span className="hi">उड़ान</span></h1>
      </div>
      <div className="nav-links">
        {[
          { label: "Dashboard", path: "/dashboard" },
          { label: "My Coach", path: "/coach" },
          { label: "Finance", path: "/finance" },
          { label: "Goals", path: "/goals" },
          { label: "Piggy Bank", path: "/piggy-bank" },
        ].map((l) => (
          <button key={l.path} className={`nav-link${typeof window !== "undefined" && window.location.pathname === l.path ? " active" : ""}`} onClick={() => router.push(l.path)}>
            {l.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <button className="user-chip" onClick={logout}>Sign out</button>
      </div>
    </nav>
  );
}

export default function FinancePage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [txnType, setTxnType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "income" | "expense">("all");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) { router.replace("/auth"); return; }
    if (isLoggedIn) {
      setTransactions(getTransactions());
    }
  }, [isLoggedIn, isLoading, router]);

  function addTransaction() {
    if (!amount || !category) return;
    const newTxn: Transaction = {
      id: Math.random().toString(36).slice(2),
      type: txnType,
      amount: parseFloat(amount),
      category,
      description,
      date: Date.now(),
    };
    const updated = [newTxn, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setShowAddModal(false);
    setAmount("");
    setCategory("");
    setDescription("");
  }

  function deleteTransaction(id: string) {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  }

  if (isLoading || !isLoggedIn) return null;

  // Calculate stats
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Filter transactions based on view mode
  const filteredTxns = viewMode === "all"
    ? transactions
    : transactions.filter((t) => t.type === viewMode);

  // Get this month's stats
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthlyIncome = monthlyTxns.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = monthlyTxns.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const displayName = user?.name || "Didi";

  return (
    <>
      <AppNav />

      <div className="page-layout">
        <div className="page-header">
          <div className="eyebrow">FINANCIAL MANAGEMENT</div>
          <h2 className="serif">Track Your Money, {displayName}! 💰</h2>
          <p>Keep track of every rupee — what comes in and what goes out.</p>
        </div>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          <div style={{ background: "#EAF7EE", borderRadius: "var(--radius)", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: ".75rem", color: "var(--leaf)", fontWeight: 700, marginBottom: 4 }}>TOTAL INCOME</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--leaf)" }}>₹{totalIncome.toLocaleString("en-IN")}</div>
          </div>
          <div style={{ background: "#FBEAEA", borderRadius: "var(--radius)", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: ".75rem", color: "#8A2B2B", fontWeight: 700, marginBottom: 4 }}>TOTAL EXPENSE</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#8A2B2B" }}>₹{totalExpense.toLocaleString("en-IN")}</div>
          </div>
          <div style={{ background: netProfit >= 0 ? "linear-gradient(135deg, var(--marigold), var(--rose))" : "#FEF3C7", borderRadius: "var(--radius)", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: ".75rem", color: "var(--ink)", fontWeight: 700, marginBottom: 4 }}>NET PROFIT</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)" }}>₹{netProfit.toLocaleString("en-IN")}</div>
          </div>
        </div>

        {/* This month's summary */}
        <div className="dash-card" style={{ marginBottom: 20, background: "linear-gradient(135deg, var(--ink) 0%, #2A3160 100%)", color: "var(--paper)" }}>
          <div style={{ fontSize: ".75rem", color: "var(--marigold)", fontWeight: 700, marginBottom: 12 }}>THIS MONTH</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: ".8rem", opacity: 0.7 }}>Income</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#4ADE80" }}>+₹{monthlyIncome.toLocaleString("en-IN")}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: ".8rem", opacity: 0.7 }}>Expense</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#F87171" }}>-₹{monthlyExpense.toLocaleString("en-IN")}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: ".8rem", opacity: 0.7 }}>Net</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--marigold)" }}>₹{(monthlyIncome - monthlyExpense).toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        {/* Add transaction buttons */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => { setTxnType("income"); setShowAddModal(true); }}
          >
            + Add Income
          </button>
          <button
            className="btn btn-ghost"
            style={{ flex: 1 }}
            onClick={() => { setTxnType("expense"); setShowAddModal(true); }}
          >
            + Add Expense
          </button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { key: "all", label: "All" },
            { key: "income", label: "Income" },
            { key: "expense", label: "Expenses" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key as typeof viewMode)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: viewMode === tab.key ? "var(--ink)" : "var(--sand)",
                color: viewMode === tab.key ? "var(--paper)" : "var(--ink)",
                fontWeight: 600,
                fontSize: ".85rem",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        <div>
          {filteredTxns.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--ink-soft)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>📊</div>
              <p>No transactions yet. Start by adding your first income or expense!</p>
            </div>
          ) : (
            filteredTxns.map((txn) => (
              <div
                key={txn.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: txn.type === "income" ? "#EAF7EE" : "#FBEAEA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    {txn.type === "income" ? "💰" : "💸"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{txn.category}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--ink-soft)" }}>
                      {txn.description || "No description"} · {formatDate(txn.date)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: txn.type === "income" ? "var(--leaf)" : "#8A2B2B",
                    }}
                  >
                    {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                  </div>
                  <button
                    onClick={() => deleteTransaction(txn.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: ".9rem",
                      opacity: 0.5,
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tips card */}
        <div className="dash-card" style={{ marginTop: 24, background: "var(--sand)" }}>
          <div style={{ fontSize: ".75rem", color: "var(--marigold-deep)", fontWeight: 700, marginBottom: 8 }}>💡 FINANCIAL TIP</div>
          <p style={{ fontSize: ".9rem", color: "var(--ink)", lineHeight: 1.6 }}>
            Write down every income and expense daily. Small leaks sink big ships. Tracking helps you see where your money goes and find ways to save more!
          </p>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 className="modal-title">
              {txnType === "income" ? "💰 Add Income" : "💸 Add Expense"}
            </h3>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(txnType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "var(--radius-full)",
                      border: category === cat ? "2px solid var(--marigold)" : "1.5px solid var(--line)",
                      background: category === cat ? "rgba(242, 160, 7, 0.1)" : "#fff",
                      color: "var(--ink)",
                      fontWeight: 600,
                      fontSize: ".85rem",
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Sold 5 samosas"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary full-width"
              onClick={addTransaction}
              disabled={!amount || !category}
              style={{ marginTop: 16 }}
            >
              {txnType === "income" ? "Add Income" : "Add Expense"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
