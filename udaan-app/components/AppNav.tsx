"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLang, LANG_NAMES, COMMON_UI, Lang } from "@/lib/language";

type AppNavProps = {
  showNotifs?: boolean;
  onNotifClick?: () => void;
  unreadCount?: number;
};

export default function AppNav({ showNotifs, onNotifClick, unreadCount = 0 }: AppNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { lang, setLang } = useLang();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = COMMON_UI[lang];

  const navLinks = [
    { label: t.dashboard, path: "/dashboard" },
    { label: t.coach, path: "/coach" },
    { label: t.finance, path: "/finance" },
    { label: t.goals, path: "/goals" },
    { label: t.piggyBank, path: "/piggy-bank" },
  ];

  return (
    <nav className="app-nav">
      <div className="brand" onClick={() => router.push("/dashboard")}>
        <div className="kite" />
        <h1 className="serif">Udaan<span className="hi">उड़ान</span></h1>
      </div>
      <div className="nav-links">
        {navLinks.map((l) => (
          <button
            key={l.path}
            className={`nav-link${pathname === l.path ? " active" : ""}`}
            onClick={() => router.push(l.path)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        {/* Language Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            className="lang-toggle-btn"
            onClick={() => setShowLangMenu(!showLangMenu)}
            style={{
              background: "rgba(255,255,255,.12)",
              border: "none",
              borderRadius: "var(--radius-full)",
              padding: "6px 12px",
              color: "#fff",
              fontSize: ".8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🌐 {LANG_NAMES[lang]}
            <span style={{ fontSize: ".7rem" }}>▼</span>
          </button>
          {showLangMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 4,
                background: "var(--paper)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                zIndex: 200,
                minWidth: 120,
              }}
            >
              {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setShowLangMenu(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    border: "none",
                    background: lang === l ? "var(--sand)" : "transparent",
                    textAlign: "left",
                    fontSize: ".88rem",
                    fontWeight: lang === l ? 700 : 500,
                    color: "var(--ink)",
                    cursor: "pointer",
                  }}
                >
                  {LANG_NAMES[l]}
                </button>
              ))}
            </div>
          )}
        </div>

        {showNotifs && onNotifClick && (
          <button className="notif-btn" onClick={onNotifClick}>
            🔔{unreadCount > 0 && <span className="notif-badge" />}
          </button>
        )}
        <button className="user-chip" onClick={logout}>{t.signOut}</button>
      </div>
    </nav>
  );
}
