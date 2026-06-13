"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, addNotification } from "@/lib/auth";

type SavingEntry = {
  id: string;
  amount: number;
  note: string;
  date: string;
  createdAt: number;
};

type SavingJar = {
  id: string;
  name: string;
  emoji: string;
  target: number;
  entries: SavingEntry[];
  createdAt: number;
};

const JARS_KEY = "udaan_piggy_jars";
const JAR_EMOJIS = ["🐷", "🏠", "📚", "💍", "✈️", "🏥", "💊", "👗", "🌟", "💝"];

function loadJars(): SavingJar[] {
  try { return JSON.parse(localStorage.getItem(JARS_KEY) || "[]"); } catch { return []; }
}
function saveJars(jars: SavingJar[]) {
  localStorage.setItem(JARS_KEY, JSON.stringify(jars));
}
function jarTotal(jar: SavingJar) {
  return jar.entries.reduce((s, e) => s + e.amount, 0);
}

const AFFIRMATIONS = [
  "Every ₹ you save is a brick in the house of your future. 🏠",
  "Your piggy bank doesn't judge. It just grows. 🌱",
  "Small amounts saved daily become big amounts over time. Keep going!",
  "Your daughter will ask how you did it. 'One rupee at a time,' you'll say. 💪",
  "The women who built wealth started exactly where you are — saving small, dreaming big.",
];

export default function PiggyBankPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [jars, setJars] = useState<SavingJar[]>([]);
  const [showAddJar, setShowAddJar] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState<string | null>(null);
  const [expandedJar, setExpandedJar] = useState<string | null>(null);
  const [jarForm, setJarForm] = useState({ name: "", emoji: "🐷", target: "" });
  const [entryForm, setEntryForm] = useState({ amount: "", note: "" });
  const [affirmation] = useState(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) { router.replace("/auth"); return; }
    if (isLoggedIn) {
      let loaded = loadJars();
      if (loaded.length === 0) {
        // Seed a default jar
        const defaultJar: SavingJar = {
          id: "default",
          name: "My Business Fund",
          emoji: "🐷",
          target: 10000,
          entries: [],
          createdAt: Date.now(),
        };
        loaded = [defaultJar];
        saveJars(loaded);
      }
      setJars(loaded);
    }
  }, [isLoggedIn, isLoading, router]);

  const grandTotal = jars.reduce((s, j) => s + jarTotal(j), 0);

  function createJar() {
    if (!jarForm.name) return;
    const jar: SavingJar = {
      id: Math.random().toString(36).slice(2),
      name: jarForm.name,
      emoji: jarForm.emoji,
      target: parseFloat(jarForm.target) || 0,
      entries: [],
      createdAt: Date.now(),
    };
    const updated = [...jars, jar];
    saveJars(updated);
    setJars(updated);
    setShowAddJar(false);
    setJarForm({ name: "", emoji: "🐷", target: "" });
  }

  function addEntry(jarId: string) {
    const amount = parseFloat(entryForm.amount);
    if (isNaN(amount) || amount <= 0) return;
    const entry: SavingEntry = {
      id: Math.random().toString(36).slice(2),
      amount,
      note: entryForm.note,
      date: new Date().toLocaleDateString("en-IN"),
      createdAt: Date.now(),
    };
    const updated = jars.map((j) => {
      if (j.id !== jarId) return j;
      const newEntries = [entry, ...j.entries];
      const total = newEntries.reduce((s, e) => s + e.amount, 0);
      if (j.target > 0 && total >= j.target) {
        addNotification({
          type: "milestone",
          emoji: "🎊",
          title: `${j.name} jar is full!`,
          body: `You've saved ₹${j.target.toLocaleString("en-IN")} in your "${j.name}" jar! You are absolutely unstoppable! 🦸‍♀️`,
        });
      }
      return { ...j, entries: newEntries };
    });
    saveJars(updated);
    setJars(updated);
    setShowAddEntry(null);
    setEntryForm({ amount: "", note: "" });
    addNotification({
      type: "motivation",
      emoji: "💰",
      title: `₹${amount.toLocaleString("en-IN")} saved!`,
      body: `Every saving counts. You're building your future one rupee at a time. Keep it up, didi! 🌟`,
    });
  }

  function deleteJar(id: string) {
    if (id === "default") return;
    const updated = jars.filter((j) => j.id !== id);
    saveJars(updated);
    setJars(updated);
  }

  if (isLoading || !isLoggedIn) return null;

  return (
    <>
      <nav className="app-nav">
        <div className="brand" onClick={() => router.push("/dashboard")}>
          <div className="kite" />
          <h1 className="serif">Udaan<span className="hi">उड़ान</span></h1>
        </div>
        <div className="nav-links">
          {[{ label: "Dashboard", path: "/dashboard" }, { label: "My Coach", path: "/coach" }, { label: "Community", path: "/community" }, { label: "Goals", path: "/goals" }, { label: "Piggy Bank", path: "/piggy-bank" }].map((l) => (
            <button key={l.path} className={`nav-link${typeof window !== "undefined" && window.location.pathname === l.path ? " active" : ""}`} onClick={() => router.push(l.path)}>{l.label}</button>
          ))}
        </div>
        <div className="nav-right"><button className="user-chip" onClick={() => router.push("/dashboard")}>← Back</button></div>
      </nav>

      <div className="page-layout">
        <div className="page-header">
          <div className="eyebrow">Piggy Bank</div>
          <h2 className="serif">Your savings, growing 🐷</h2>
          <p>Separate jars for separate dreams. Watch your money grow.</p>
        </div>

        {/* Grand total hero */}
        <div className="piggy-hero">
          <div style={{ fontSize: "3rem", marginBottom: 8 }}>🐷</div>
          <div className="piggy-label">Total saved across all jars</div>
          <div className="piggy-total">₹{grandTotal.toLocaleString("en-IN")}</div>
          <div className="piggy-sub">{affirmation}</div>
        </div>

        {/* Jars */}
        {jars.map((jar) => {
          const total = jarTotal(jar);
          const pct = jar.target > 0 ? Math.min((total / jar.target) * 100, 100) : null;
          const isExpanded = expandedJar === jar.id;
          return (
            <div key={jar.id} className="dash-card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: "2rem" }}>{jar.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.02rem" }}>{jar.name}</div>
                    <div style={{ fontSize: ".8rem", color: "var(--ink-soft)" }}>
                      {jar.entries.length} saving{jar.entries.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--leaf)" }}>₹{total.toLocaleString("en-IN")}</div>
                  {jar.target > 0 && (
                    <div style={{ fontSize: ".72rem", color: "var(--ink-soft)" }}>of ₹{jar.target.toLocaleString("en-IN")}</div>
                  )}
                </div>
              </div>

              {pct !== null && (
                <div className="progress-wrap" style={{ marginBottom: 12 }}>
                  <div className="progress-label">
                    <span>{Math.round(pct)}%</span>
                    {pct < 100 && <span>₹{(jar.target - total).toLocaleString("en-IN")} to go</span>}
                    {pct >= 100 && <span style={{ color: "var(--leaf)", fontWeight: 700 }}>🎉 Goal reached!</span>}
                  </div>
                  <div className="progress-bar"><div className="progress-fill green" style={{ width: `${pct}%` }} /></div>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, marginBottom: isExpanded ? 14 : 0 }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddEntry(jar.id)}>+ Save money</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setExpandedJar(isExpanded ? null : jar.id)}>
                  {isExpanded ? "Hide history ↑" : "History ↓"}
                </button>
                {jar.id !== "default" && (
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--rose)", borderColor: "var(--rose)" }} onClick={() => deleteJar(jar.id)}>Delete</button>
                )}
              </div>

              {isExpanded && (
                <div>
                  {jar.entries.length === 0 && (
                    <p style={{ fontSize: ".85rem", color: "var(--ink-soft)", textAlign: "center", padding: "12px 0" }}>No savings yet. Add your first! 🌱</p>
                  )}
                  {jar.entries.map((e) => (
                    <div key={e.id} className="saving-entry">
                      <div>
                        <div className="saving-entry note">{e.note || "Savings"}</div>
                        <div className="saving-entry date">{e.date}</div>
                      </div>
                      <div className="saving-entry amount">+₹{e.amount.toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Add jar */}
        <div className="add-goal-card" onClick={() => setShowAddJar(true)}>
          <div className="icon">🏺</div>
          <p>Create a new savings jar</p>
        </div>

        {/* Tips */}
        <div className="dash-card" style={{ marginTop: 20, background: "linear-gradient(135deg, var(--ink), #2A3160)", border: "none" }}>
          <div className="dash-card-title" style={{ color: "var(--marigold)" }}>💡 Smart Saving Tips</div>
          {[
            "Open a Jan Dhan zero-balance account this week — free, and your money is safe.",
            "Save first, spend later. Even ₹10/day = ₹3,650/year.",
            "Join a local SHG (Self-Help Group) for group savings and easy credit.",
            "Keep a separate savings jar for unexpected expenses (medical, repairs).",
          ].map((tip, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: i < 3 ? "1px dashed rgba(255,255,255,.12)" : "none", fontSize: ".88rem", color: "rgba(255,255,255,.78)", lineHeight: 1.55 }}>
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Add jar modal */}
      {showAddJar && (
        <div className="modal-overlay" onClick={() => setShowAddJar(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Create a savings jar 🏺</div>
            <div className="form-group">
              <label className="form-label">Pick an emoji</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {JAR_EMOJIS.map((e) => (
                  <button key={e} onClick={() => setJarForm(f => ({ ...f, emoji: e }))}
                    style={{ width: 38, height: 38, fontSize: "1.4rem", border: `2px solid ${jarForm.emoji === e ? "var(--marigold)" : "var(--line)"}`, borderRadius: 8, background: jarForm.emoji === e ? "var(--sand)" : "#fff", cursor: "pointer" }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Jar name</label>
              <input className="form-input" placeholder="e.g. Family medical fund" value={jarForm.name} onChange={(e) => setJarForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Target amount ₹ (optional)</label>
              <input className="form-input" type="number" placeholder="e.g. 20000" value={jarForm.target} onChange={(e) => setJarForm(f => ({ ...f, target: e.target.value }))} />
            </div>
            <button className="btn btn-primary full-width" onClick={createJar}>Create jar</button>
          </div>
        </div>
      )}

      {/* Add entry modal */}
      {showAddEntry && (
        <div className="modal-overlay" onClick={() => setShowAddEntry(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Add to {jars.find(j => j.id === showAddEntry)?.name} 💰</div>
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input className="form-input" type="number" autoFocus placeholder="e.g. 500" value={entryForm.amount}
                onChange={(e) => setEntryForm(f => ({ ...f, amount: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addEntry(showAddEntry)} />
            </div>
            <div className="form-group">
              <label className="form-label">Note (optional)</label>
              <input className="form-input" placeholder="e.g. Tiffin earnings" value={entryForm.note} onChange={(e) => setEntryForm(f => ({ ...f, note: e.target.value }))} />
            </div>
            <button className="btn btn-primary full-width" onClick={() => addEntry(showAddEntry)}>Save money</button>
          </div>
        </div>
      )}
    </>
  );
}
