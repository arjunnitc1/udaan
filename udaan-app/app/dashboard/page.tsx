"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAuth,
  getNotifications,
  markAllRead,
  addNotification,
  DAILY_NUDGES,
  AppNotification,
} from "@/lib/auth";
import heroesData from "@/data/community-heroes.json";

const TIPS = [
  "Take a photo of every order you complete. Your Instagram page fills itself.",
  "Tell 5 neighbours about your service today. Word-of-mouth is free advertising.",
  "Write down what you earn every day in a notebook. Watching it grow is addictive.",
  "Your first customer is already in your contact list. Who comes to mind?",
  "Price like this: cost of materials + YOUR time at ₹50/hr minimum. Never less.",
];

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
  return Math.floor(diff / 86400000) + "d ago";
}

function AppNav({ onNotifClick, unreadCount }: { onNotifClick: () => void; unreadCount: number }) {
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
        <button className="notif-btn" onClick={onNotifClick}>
          🔔{unreadCount > 0 && <span className="notif-badge" />}
        </button>
        <button className="user-chip" onClick={logout}>Sign out</button>
      </div>
    </nav>
  );
}

export default function Dashboard() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [todayTip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [todayNudge] = useState(DAILY_NUDGES[Math.floor(Math.random() * DAILY_NUDGES.length)]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) { router.replace("/auth"); return; }
    if (isLoggedIn) {
      const stored = getNotifications();
      setNotifs(stored);
      // Seed a daily nudge if last one was > 4h ago
      const last = stored[0];
      if (!last || Date.now() - last.timestamp > 4 * 3600000) {
        const n = addNotification({ ...todayNudge, type: "motivation" });
        setNotifs([n, ...stored]);
      }
    }
  }, [isLoggedIn, isLoading, router, todayNudge]);

  function handleMarkAllRead() {
    markAllRead();
    setNotifs(getNotifications());
  }

  if (isLoading || !isLoggedIn) return null;

  const unread = notifs.filter((n) => !n.read).length;
  const previewHeroes = heroesData.heroes.slice(0, 2);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.name || `+91 ${user?.phone?.slice(0, 5)}…`;

  return (
    <>
      <AppNav onNotifClick={() => setShowNotifs(!showNotifs)} unreadCount={unread} />

      <div className="dash-layout">
        {/* Greeting */}
        <div className="dash-greeting">
          <div className="greeting-sup">{greeting()}</div>
          <h2 className="serif">Namaste, {displayName}! 🌟</h2>
          <p className="sub">Ready to build your empire today?</p>
        </div>

        {/* Motivation strip */}
        <div className="motivation-card" style={{ borderRadius: "var(--radius)", padding: "22px", marginBottom: "20px" }}>
          <div className="quote" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.6, marginBottom: 6 }}>
            {todayNudge.emoji} {todayNudge.body}
          </div>
          <div style={{ fontSize: ".78rem", color: "rgba(27,33,67,.6)" }}>Today&apos;s power message from Udaan</div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          {[
            { icon: "🤖", label: "Talk to Coach", sub: "Get your plan", path: "/coach" },
            { icon: "💰", label: "Finance", sub: "Track money", path: "/finance" },
            { icon: "🎯", label: "My Goals", sub: "Track progress", path: "/goals" },
            { icon: "🐷", label: "Piggy Bank", sub: "Save & grow", path: "/piggy-bank" },
          ].map((a) => (
            <div key={a.path} className="qa-card" onClick={() => router.push(a.path)}>
              <div className="qa-icon">{a.icon}</div>
              <div className="qa-label">{a.label}</div>
              <div className="qa-sub">{a.sub}</div>
            </div>
          ))}
        </div>

        {/* 2-col grid */}
        <div className="dash-grid">
          {/* Coach CTA */}
          <div className="dash-card coach-cta-card">
            <div className="dash-card-title">Your Business Coach</div>
            <p>Tell Udaan what you&apos;re good at. Get your business plan, pricing, WhatsApp message, and government schemes — all in your language.</p>
            <button className="btn btn-primary btn-sm" onClick={() => router.push("/coach")}>
              Start conversation →
            </button>
          </div>

          {/* Today's tip */}
          <div className="dash-card">
            <div className="dash-card-title">💡 Tip of the Day</div>
            <p style={{ fontSize: ".92rem", color: "var(--ink-soft)", lineHeight: 1.6 }}>{todayTip}</p>
          </div>
        </div>

        {/* Notifications */}
        {showNotifs && (
          <div className="notif-strip">
            <div className="notif-panel-header">
              <h3>Notifications {unread > 0 && <span style={{ background: "var(--marigold)", color: "var(--ink)", borderRadius: "99px", padding: "2px 8px", fontSize: ".72rem", fontWeight: 700, marginLeft: 6 }}>{unread}</span>}</h3>
              <button onClick={handleMarkAllRead}>Mark all read</button>
            </div>
            {notifs.length === 0 && <p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>No notifications yet.</p>}
            {notifs.slice(0, 6).map((n) => (
              <div key={n.id} className={`notif-item${!n.read ? " unread" : ""}`}>
                <div className="notif-emoji">{n.emoji}</div>
                <div className="notif-content">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-body">{n.body}</div>
                  <div className="notif-time">{timeAgo(n.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community heroes teaser */}
        <div className="dash-card" style={{ marginTop: 0 }}>
          <div className="dash-card-title">🏆 Community Heroes</div>
          <p style={{ fontSize: ".85rem", color: "var(--ink-soft)", marginBottom: 16 }}>
            Women who used Udaan to launch real businesses. Get inspired — or reach out to them directly.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {previewHeroes.map((h) => (
              <div key={h.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="hero-avatar" style={{ width: 44, height: 44, fontSize: "1.2rem" }}>{h.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{h.name}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--ink-soft)" }}>{h.location} · {h.business}</div>
                </div>
                <div className="hero-income" style={{ fontSize: ".75rem" }}>{h.monthlyIncome}/mo</div>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm full-width mt-16" onClick={() => router.push("/community")}>
            Meet all heroes →
          </button>
        </div>
      </div>
    </>
  );
}
