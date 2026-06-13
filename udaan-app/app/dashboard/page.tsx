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
import { useLang, DASHBOARD_UI, type Lang } from "@/lib/language";
import AppNav from "@/components/AppNav";
import heroesData from "@/data/community-heroes.json";

const TIPS: Record<Lang, string[]> = {
  en: [
    "Take a photo of every order you complete. Your Instagram page fills itself.",
    "Tell 5 neighbours about your service today. Word-of-mouth is free advertising.",
    "Write down what you earn every day in a notebook. Watching it grow is addictive.",
    "Your first customer is already in your contact list. Who comes to mind?",
    "Price like this: cost of materials + YOUR time at ₹50/hr minimum. Never less.",
  ],
  hi: [
    "हर ऑर्डर पूरा होने पर फोटो लें। आपका Instagram पेज खुद भर जाएगा।",
    "आज 5 पड़ोसियों को अपनी सेवा के बारे में बताएं। मुंह की बात फ्री विज्ञापन है।",
    "हर दिन अपनी कमाई नोटबुक में लिखें। बढ़ते देखना नशे जैसा है।",
    "आपका पहला ग्राहक आपके संपर्क सूची में पहले से है। कौन याद आता है?",
    "दाम इस तरह रखें: सामान की लागत + आपका समय ₹50/घंटा कम से कम।",
  ],
  bn: [
    "প্রতিটি অর্ডার সম্পূর্ণ হলে ছবি তুলুন। আপনার Instagram পেজ নিজেই ভরে যাবে।",
    "আজ 5 জন প্রতিবেশীকে আপনার সেবা সম্পর্কে বলুন। মুখের কথা বিনামূল্যে বিজ্ঞাপন।",
    "প্রতিদিন আপনার আয় নোটবুকে লিখুন। বাড়তে দেখা নেশার মতো।",
    "আপনার প্রথম গ্রাহক ইতিমধ্যে আপনার কন্টাক্ট লিস্টে আছেন। কে মনে পড়ছে?",
    "দাম এভাবে রাখুন: উপকরণের খরচ + আপনার সময় ₹50/ঘন্টা সর্বনিম্ন।",
  ],
  ml: [
    "എല്ലാ ഓർഡറും പൂർത്തിയാകുമ്പോൾ ഫോട്ടോ എടുക്കുക. നിങ്ങളുടെ Instagram പേജ് സ്വയം നിറയും.",
    "ഇന്ന് 5 അയൽക്കാർക്ക് നിങ്ങളുടെ സേവനത്തെക്കുറിച്ച് പറയുക. വാക്കാലുള്ള പരസ്യം സൗജന്യമാണ്.",
    "എല്ലാ ദിവസവും നിങ്ങളുടെ വരുമാനം നോട്ട്ബുക്കിൽ എഴുതുക. വളരുന്നത് കാണുന്നത് ആവേശകരമാണ്.",
    "നിങ്ങളുടെ ആദ്യ ഉപഭോക്താവ് ഇതിനകം നിങ്ങളുടെ കോൺടാക്ട് ലിസ്റ്റിലുണ്ട്. ആരെ ഓർക്കുന്നു?",
    "വില ഇങ്ങനെ സജ്ജമാക്കുക: മെറ്റീരിയലിന്റെ വില + നിങ്ങളുടെ സമയം ₹50/മണിക്കൂർ കുറഞ്ഞത്.",
  ],
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
  return Math.floor(diff / 86400000) + "d ago";
}

export default function Dashboard() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const t = DASHBOARD_UI[lang];
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [tipIndex] = useState(Math.floor(Math.random() * TIPS.en.length));
  const todayTip = TIPS[lang][tipIndex];
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
    if (h < 12) return t.goodMorning;
    if (h < 17) return t.goodAfternoon;
    return t.goodEvening;
  };

  const displayName = user?.name || `+91 ${user?.phone?.slice(0, 5)}…`;

  return (
    <>
      <AppNav showNotifs onNotifClick={() => setShowNotifs(!showNotifs)} unreadCount={unread} />

      <div className="dash-layout">
        {/* Greeting */}
        <div className="dash-greeting">
          <div className="greeting-sup">{greeting()}</div>
          <h2 className="serif">{t.namaste}, {displayName}! 🌟</h2>
          <p className="sub">{t.readyToBuild}</p>
        </div>

        {/* Motivation strip */}
        <div className="motivation-card" style={{ borderRadius: "var(--radius)", padding: "22px", marginBottom: "20px" }}>
          <div className="quote" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.6, marginBottom: 6 }}>
            {todayNudge.emoji} {todayNudge.body}
          </div>
          <div style={{ fontSize: ".78rem", color: "rgba(27,33,67,.6)" }}>{t.todayPowerMessage}</div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          {[
            { icon: "🤖", label: t.talkToCoach, sub: t.getYourPlan, path: "/coach" },
            { icon: "💰", label: t.trackMoney, sub: t.trackMoney, path: "/finance" },
            { icon: "🎯", label: t.myGoals, sub: t.trackProgress, path: "/goals" },
            { icon: "🐷", label: t.saveAndGrow, sub: t.saveAndGrow, path: "/piggy-bank" },
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
            <div className="dash-card-title">{t.yourBusinessCoach}</div>
            <p>{t.coachDesc}</p>
            <button className="btn btn-primary btn-sm" onClick={() => router.push("/coach")}>
              {t.startConversation}
            </button>
          </div>

          {/* Today's tip */}
          <div className="dash-card">
            <div className="dash-card-title">{t.tipOfTheDay}</div>
            <p style={{ fontSize: ".92rem", color: "var(--ink-soft)", lineHeight: 1.6 }}>{todayTip}</p>
          </div>
        </div>

        {/* Notifications */}
        {showNotifs && (
          <div className="notif-strip">
            <div className="notif-panel-header">
              <h3>{t.notifications} {unread > 0 && <span style={{ background: "var(--marigold)", color: "var(--ink)", borderRadius: "99px", padding: "2px 8px", fontSize: ".72rem", fontWeight: 700, marginLeft: 6 }}>{unread}</span>}</h3>
              <button onClick={handleMarkAllRead}>{t.markAllRead}</button>
            </div>
            {notifs.length === 0 && <p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>{t.noNotifications}</p>}
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
          <div className="dash-card-title">{t.communityHeroes}</div>
          <p style={{ fontSize: ".85rem", color: "var(--ink-soft)", marginBottom: 16 }}>
            {t.heroesDesc}
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
            {t.meetAllHeroes}
          </button>
        </div>
      </div>
    </>
  );
}
