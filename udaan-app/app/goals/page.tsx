"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, addNotification } from "@/lib/auth";
import AppNav from "@/components/AppNav";

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  emoji: string;
  status: "active" | "done";
  createdAt: number;
};

const GOALS_KEY = "udaan_goals";
const EMOJIS = ["🏠", "📚", "💍", "✈️", "🏥", "🛒", "💻", "🎓", "👗", "🌟"];

function loadGoals(): Goal[] {
  try { return JSON.parse(localStorage.getItem(GOALS_KEY) || "[]"); } catch { return []; }
}
function saveGoals(goals: Goal[]) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export default function GoalsPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showContrib, setShowContrib] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", targetAmount: "", deadline: "", emoji: "🎯" });
  const [contribAmount, setContribAmount] = useState("");
  const [formErr, setFormErr] = useState("");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) { router.replace("/auth"); return; }
    if (isLoggedIn) setGoals(loadGoals());
  }, [isLoggedIn, isLoading, router]);

  function addGoal() {
    if (!form.title || !form.targetAmount) { setFormErr("Please fill in a name and target amount."); return; }
    const target = parseFloat(form.targetAmount);
    if (isNaN(target) || target <= 0) { setFormErr("Enter a valid target amount."); return; }
    const newGoal: Goal = {
      id: Math.random().toString(36).slice(2),
      title: form.title,
      targetAmount: target,
      currentAmount: 0,
      deadline: form.deadline,
      emoji: form.emoji,
      status: "active",
      createdAt: Date.now(),
    };
    const updated = [newGoal, ...goals];
    saveGoals(updated);
    setGoals(updated);
    setShowAdd(false);
    setForm({ title: "", targetAmount: "", deadline: "", emoji: "🎯" });
    setFormErr("");
    addNotification({
      type: "milestone",
      emoji: "🎯",
      title: `Goal set: ${newGoal.title}`,
      body: `₹${newGoal.targetAmount.toLocaleString("en-IN")} goal created. Every rupee you earn brings you closer. You've got this, didi! 💪`,
    });
  }

  function addContribution() {
    const amount = parseFloat(contribAmount);
    if (!showContrib || isNaN(amount) || amount <= 0) return;
    const updated = goals.map((g) => {
      if (g.id !== showContrib) return g;
      const newAmount = Math.min(g.currentAmount + amount, g.targetAmount);
      const isDone = newAmount >= g.targetAmount;
      if (isDone) {
        addNotification({
          type: "milestone",
          emoji: "🏆",
          title: `Goal achieved: ${g.title}!`,
          body: `You did it, didi! You reached your ₹${g.targetAmount.toLocaleString("en-IN")} goal. This is what superwoman looks like! 🦸‍♀️`,
        });
      } else if (newAmount / g.targetAmount >= 0.5 && g.currentAmount / g.targetAmount < 0.5) {
        addNotification({
          type: "milestone",
          emoji: "🌟",
          title: `Halfway there: ${g.title}`,
          body: `50% done! You're halfway to your ₹${g.targetAmount.toLocaleString("en-IN")} goal. The second half is always faster!`,
        });
      }
      return { ...g, currentAmount: newAmount, status: isDone ? "done" as const : g.status };
    });
    saveGoals(updated);
    setGoals(updated);
    setShowContrib(null);
    setContribAmount("");
  }

  function deleteGoal(id: string) {
    const updated = goals.filter((g) => g.id !== id);
    saveGoals(updated);
    setGoals(updated);
  }

  const active = goals.filter((g) => g.status === "active");
  const done = goals.filter((g) => g.status === "done");

  if (isLoading || !isLoggedIn) return null;

  return (
    <>
      <AppNav />

      <div className="page-layout">
        <div className="page-header">
          <div className="eyebrow">Goals Tracker</div>
          <h2 className="serif">Your dreams, made real 🎯</h2>
          <p>Set a goal, add your earnings, watch your dream get closer every day.</p>
        </div>

        {/* Summary */}
        {goals.length > 0 && (
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <div className="dash-card" style={{ flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{active.length}</div>
              <div style={{ fontSize: ".75rem", color: "var(--ink-soft)" }}>Active goals</div>
            </div>
            <div className="dash-card" style={{ flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--leaf)" }}>{done.length}</div>
              <div style={{ fontSize: ".75rem", color: "var(--ink-soft)" }}>Achieved 🏆</div>
            </div>
            <div className="dash-card" style={{ flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                ₹{goals.reduce((s, g) => s + g.currentAmount, 0).toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: ".75rem", color: "var(--ink-soft)" }}>Total saved</div>
            </div>
          </div>
        )}

        {/* Active goals */}
        {active.map((g) => {
          const pct = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
          const remaining = g.targetAmount - g.currentAmount;
          return (
            <div key={g.id} className="goal-card">
              <div className="goal-top">
                <div>
                  <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{g.emoji}</div>
                  <div className="goal-title">{g.title}</div>
                  <div className="goal-amount">
                    ₹{g.currentAmount.toLocaleString("en-IN")} of ₹{g.targetAmount.toLocaleString("en-IN")}
                  </div>
                </div>
                <span className="goal-badge active">Active</span>
              </div>
              <div className="progress-wrap">
                <div className="progress-label">
                  <span>{Math.round(pct)}% complete</span>
                  <span>₹{remaining.toLocaleString("en-IN")} to go</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              </div>
              <div className="goal-meta">
                {g.deadline && <span>📅 Target: {new Date(g.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                {pct >= 75 && <span style={{ color: "var(--leaf)", fontWeight: 700 }}>🔥 Almost there!</span>}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowContrib(g.id)}>+ Add savings</button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--rose)", borderColor: "var(--rose)" }} onClick={() => deleteGoal(g.id)}>Delete</button>
              </div>
            </div>
          );
        })}

        {/* Achieved goals */}
        {done.map((g) => (
          <div key={g.id} className="goal-card" style={{ opacity: .8 }}>
            <div className="goal-top">
              <div>
                <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{g.emoji}</div>
                <div className="goal-title">{g.title}</div>
                <div className="goal-amount" style={{ color: "var(--leaf)" }}>✓ ₹{g.targetAmount.toLocaleString("en-IN")} achieved!</div>
              </div>
              <span className="goal-badge done">Done 🏆</span>
            </div>
            <div className="progress-bar"><div className="progress-fill green" style={{ width: "100%" }} /></div>
          </div>
        ))}

        {/* Add goal button */}
        <div className="add-goal-card" onClick={() => setShowAdd(true)}>
          <div className="icon">+</div>
          <p>Add a new goal</p>
        </div>
      </div>

      {/* Add goal modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Set a new goal 🎯</div>
            {formErr && <div className="auth-error">{formErr}</div>}
            <div className="form-group">
              <label className="form-label">Pick an emoji</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    style={{ width: 38, height: 38, fontSize: "1.4rem", border: `2px solid ${form.emoji === e ? "var(--marigold)" : "var(--line)"}`, borderRadius: 8, background: form.emoji === e ? "var(--sand)" : "#fff", cursor: "pointer" }}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Goal name</label>
              <input className="form-input" placeholder="e.g. Daughter's school fees" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Target amount (₹)</label>
              <input className="form-input" type="number" placeholder="e.g. 50000" value={form.targetAmount} onChange={(e) => setForm(f => ({ ...f, targetAmount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Target date (optional)</label>
              <input className="form-input" type="date" value={form.deadline} onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </div>
            <button className="btn btn-primary full-width" onClick={addGoal}>Create goal</button>
          </div>
        </div>
      )}

      {/* Add contribution modal */}
      {showContrib && (
        <div className="modal-overlay" onClick={() => setShowContrib(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Add to your savings 💰</div>
            <div className="form-group">
              <label className="form-label">Amount saved (₹)</label>
              <input className="form-input" type="number" autoFocus placeholder="e.g. 500" value={contribAmount} onChange={(e) => setContribAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addContribution()} />
            </div>
            <button className="btn btn-primary full-width" onClick={addContribution}>Add savings</button>
          </div>
        </div>
      )}
    </>
  );
}
