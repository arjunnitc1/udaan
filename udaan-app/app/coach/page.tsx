"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, addNotification } from "@/lib/auth";
import { DEMO_SCENARIOS, type DemoScenario } from "@/lib/demo";
import { useLang } from "@/lib/language";
import type { Kit } from "@/lib/types";

type Lang = "en" | "hi";
type ChatMsg = { who: "coach" | "user"; text: string };

// Detect script/language from user input
function detectLangCode(text: string): string {
  if (/[ऀ-ॿ]/.test(text)) return "hi-IN";
  if (/[஀-௿]/.test(text)) return "ta-IN";
  if (/[ఀ-౿]/.test(text)) return "te-IN";
  if (/[ಀ-೿]/.test(text)) return "kn-IN";
  if (/[ঀ-৿]/.test(text)) return "bn-IN";
  return "en-IN";
}

function speak(text: string, langCode: string, onStart?: () => void, onEnd?: () => void) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langCode;
  utt.rate = 0.92;
  utt.pitch = 1.05;

  // Load voices if not already loaded
  let voices = synth.getVoices();
  if (voices.length === 0) {
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
      const match = voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));
      if (match) utt.voice = match;
    };
  } else {
    const match = voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));
    if (match) utt.voice = match;
  }

  utt.onstart = () => onStart?.();
  utt.onend = () => onEnd?.();
  utt.onerror = () => onEnd?.();

  synth.speak(utt);
}

const LANG_LABELS: Record<string, string> = {
  "hi-IN": "हिन्दी",
  "ta-IN": "தமிழ்",
  "te-IN": "తెలుగు",
  "kn-IN": "ಕನ್ನಡ",
  "bn-IN": "বাংলা",
  "en-IN": "English",
};

type UIStrings = {
  greeting: string; placeholder: string; restart: string; kitEyebrow: string; kitTitle: string;
  cBiz: string; cPrice: string; cWa: string; cSchemes: string; cYear: string; cInsta: string;
  cFb: string; cVendors: string; cMgmt: string; cAction: string; copy: string; copied: string;
  perMonth: string; perYear: string; scriptLabel: string; saveLabel: string; disclaimer: string;
  err: string; voiceOff: string; demoMode: string; voiceOn: string; voiceOff2: string;
  cSell: string; cShip: string;
  tabs: string[];
};
const UI: Record<Lang, UIStrings> = {
  en: {
    greeting: "Namaste! I'm Udaan, your business coach and biggest cheerleader. Tell me a little about yourself: where are you from, and who's at home with you? 🪁",
    placeholder: "Type or speak…",
    restart: "Start fresh",
    kitEyebrow: "YOUR UDAAN KIT",
    kitTitle: "Your business, ready to fly",
    cBiz: "What you can start",
    cPrice: "Your prices (counting YOUR time)",
    cWa: "Your first WhatsApp message",
    cSchemes: "Government support for you",
    cYear: "Your possible year",
    cInsta: "Instagram setup",
    cFb: "Facebook Marketplace",
    cVendors: "Where to source materials",
    cMgmt: "Running your business",
    cAction: "Do this today",
    copy: "Copy for WhatsApp",
    copied: "Copied ✓",
    perMonth: "per month",
    perYear: "in one year",
    scriptLabel: "How to say your price:",
    saveLabel: "Your first savings habit:",
    disclaimer: "Estimates are illustrative, not guarantees. Scheme details: verify on official portals.",
    err: "The coach couldn't connect. Please check your internet connection and try again.",
    voiceOff: "Voice not available in this browser. Please use Chrome.",
    demoMode: "▶ Demo mode: Sunita's real Udaan journey",
    voiceOn: "🔊 Voice on",
    voiceOff2: "🔇 Voice off",
    cSell: "Where to Sell Online",
    cShip: "Delivery Partners",
    tabs: ["Plan", "Social Media", "Sell & Ship", "Vendors", "Tips"],
  },
  hi: {
    greeting: "नमस्ते! मैं उड़ान हूँ, आपकी बिज़नेस कोच और आपकी सबसे बड़ी हिम्मत। बताइए अपने बारे में: आप कहाँ रहती हैं, और घर में कौन-कौन है? 🪁",
    placeholder: "लिखें या बोलें…",
    restart: "नई शुरुआत",
    kitEyebrow: "आपकी उड़ान किट",
    kitTitle: "आपका बिज़नेस, उड़ान के लिए तैयार",
    cBiz: "आप क्या शुरू कर सकती हैं",
    cPrice: "आपके दाम (आपकी मेहनत गिनकर)",
    cWa: "आपका पहला WhatsApp संदेश",
    cSchemes: "सरकारी योजनाएँ आपके लिए",
    cYear: "आपका संभावित साल",
    cInsta: "Instagram सेटअप",
    cFb: "Facebook Marketplace",
    cVendors: "सामान कहाँ से लें",
    cMgmt: "बिज़नेस कैसे चलाएँ",
    cAction: "आज ही करें",
    copy: "WhatsApp के लिए कॉपी करें",
    copied: "कॉपी हो गया ✓",
    perMonth: "हर महीने",
    perYear: "एक साल में",
    scriptLabel: "दाम बताने का तरीका:",
    saveLabel: "बचत की पहली आदत:",
    disclaimer: "अनुमान केवल उदाहरण हैं, गारंटी नहीं। योजना की जानकारी आधिकारिक पोर्टल पर जाँचें।",
    err: "कोच से कनेक्ट नहीं हो पाया। कृपया अपना इंटरनेट कनेक्शन जाँचें और फिर कोशिश करें।",
    voiceOff: "इस ब्राउज़र में वॉइस उपलब्ध नहीं। Chrome इस्तेमाल करें।",
    demoMode: "▶ डेमो: सुनीता की उड़ान यात्रा",
    voiceOn: "🔊 आवाज़ चालू",
    voiceOff2: "🔇 आवाज़ बंद",
    cSell: "ऑनलाइन कहाँ बेचें",
    cShip: "डिलीवरी पार्टनर",
    tabs: ["प्लान", "सोशल मीडिया", "बेचें और भेजें", "सामान", "टिप्स"],
  },
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function logEvent(sessionId: string, type: string, payload?: unknown) {
  fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, type, payload }),
  }).catch(() => {});
}

export default function CoachPage() {
  const { user, isLoggedIn, isLoading, updateProfile } = useAuth();
  const router = useRouter();

  const [lang, setLang] = useState<Lang>("en");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [kit, setKit] = useState<Kit | null>(null);
  const [kitTab, setKitTab] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [detectedLang, setDetectedLang] = useState("en-IN");
  const [demoMode, setDemoMode] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  const apiMessages = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const sessionId = useRef(user?.sessionId ?? "s-" + Math.random().toString(36).slice(2));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = UI[lang];
  const bi = (en?: string, hi?: string) => (lang === "hi" ? hi || en || "" : en || hi || "");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) { router.replace("/auth"); return; }
    if (isLoggedIn && chat.length === 0) {
      setChat([{ who: "coach", text: t.greeting }]);
      logEvent(sessionId.current, "session_start", { lang });
      if (voiceEnabled) {
        speak(t.greeting, lang === "hi" ? "hi-IN" : "en-IN", () => setSpeaking(true), () => setSpeaking(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isLoading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, thinking, kit]);

  // Restart chat when language changes
  useEffect(() => {
    if (chat.length > 0) {
      setChat([{ who: "coach", text: t.greeting }]);
      apiMessages.current = [];
      setKit(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  async function startDemo(scenario: DemoScenario) {
    setShowDemoSelector(false);
    setDemoMode(true);
    logEvent(sessionId.current, "session_start", { demo: true, lang, scenario: scenario.id });
    const demoLabel = lang === "hi" ? `▶ डेमो: ${scenario.name_hi}` : `▶ Demo: ${scenario.name_en}`;
    setChat([{ who: "coach", text: demoLabel }]);
    for (const step of scenario.script) {
      await wait(1300);
      const text = lang === "hi" ? step.hi : step.en;
      setChat((c) => [...c, { who: step.who, text }]);
      if (voiceEnabled && step.who === "coach") {
        speak(text, lang === "hi" ? "hi-IN" : "en-IN", () => setSpeaking(true), () => setSpeaking(false));
      }
    }
    await wait(1100);
    setThinking(true);
    await wait(1700);
    setThinking(false);
    const introText = bi(scenario.kit.intro_en, scenario.kit.intro_hi);
    setChat((c) => [...c, { who: "coach", text: introText }]);
    if (voiceEnabled) {
      speak(introText, lang === "hi" ? "hi-IN" : "en-IN", () => setSpeaking(true), () => setSpeaking(false));
    }
    await wait(800);
    setKit(scenario.kit);
    logEvent(sessionId.current, "kit_generated", { demo: true });
  }

  async function sendMsg(forced?: string) {
    const text = (forced ?? input).trim();
    if (!text || thinking) return;
    setInput("");
    setError("");
    const detected = detectLangCode(text);
    setDetectedLang(detected);
    setChat((c) => [...c, { who: "user", text }]);
    apiMessages.current.push({ role: "user", content: text });
    logEvent(sessionId.current, "interview_answer");
    setThinking(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId.current,
        },
        body: JSON.stringify({ messages: apiMessages.current }),
      });

      const data = await res.json();

      // Handle API errors
      if (!res.ok || data.error) {
        setThinking(false);
        const errMsg = data.error || `Error ${res.status}`;
        setError(errMsg);
        console.error("API error:", errMsg);
        return;
      }

      apiMessages.current.push({ role: "assistant", content: data.raw });
      setThinking(false);

      const reply = data.reply;
      if (reply.type === "question") {
        const msgText = bi(reply.text_en, reply.text_hi);
        setChat((c) => [...c, { who: "coach", text: msgText }]);
        if (voiceEnabled) {
          speak(msgText, detected, () => setSpeaking(true), () => setSpeaking(false));
        }
      } else if (reply.type === "kit") {
        const introText = bi(reply.intro_en, reply.intro_hi) || "🎉";
        setChat((c) => [...c, { who: "coach", text: introText }]);
        if (voiceEnabled) {
          speak(introText, detected, () => setSpeaking(true), () => setSpeaking(false));
        }
        await wait(700);
        setKit(reply as Kit);
        logEvent(sessionId.current, "kit_generated", { demo: false });
        updateProfile({ kitGenerated: true });
        addNotification({
          type: "milestone",
          emoji: "🎉",
          title: "Your business plan is ready!",
          body: "Udaan has generated your personalised Udaan Kit. Your journey to financial freedom starts now, didi!",
        });
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setThinking(false);
      setError(t.err);
    }
  }

  function toggleMic() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert(t.voiceOff); return; }
    if (recognition.current) { recognition.current.stop(); return; }
    const rec = new SR();
    rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = true;
    setListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      setInput(Array.from(e.results).map((r: any) => r[0].transcript).join(""));
    };
    rec.onend = () => { setListening(false); recognition.current = null; };
    rec.onerror = () => { setListening(false); recognition.current = null; };
    recognition.current = rec;
    rec.start();
  }

  function toggleVoice() {
    if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false); }
    setVoiceEnabled(!voiceEnabled);
  }

  function copyWa() {
    if (!kit) return;
    const txt = bi(kit.whatsapp_en, kit.whatsapp_hi);
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      logEvent(sessionId.current, "whatsapp_copied");
      addNotification({
        type: "milestone",
        emoji: "📱",
        title: "WhatsApp message copied!",
        body: "You're one tap away from your first customer. Send that message now, your first order is closer than you think!",
      });
      setTimeout(() => setCopied(false), 1800);
    });
  }

  if (isLoading || !isLoggedIn) return null;

  const TABS = t.tabs;

  return (
    <>
      {/* Compact nav */}
      <nav className="app-nav">
        <div className="brand" onClick={() => router.push("/")}>
          <div className="kite" />
          <h1 className="serif">Udaan<span className="hi">उड़ान</span></h1>
        </div>
        <div className="nav-links" style={{ display: "flex", gap: 4 }}>
          <button className="nav-link" onClick={() => router.push("/dashboard")}>Dashboard</button>
          <button className="nav-link active">Coach</button>
          <button className="nav-link" onClick={() => router.push("/finance")}>Finance</button>
          <button className="nav-link" onClick={() => router.push("/community")}>Community</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="lang-toggle">
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "hi" ? "active" : ""} onClick={() => setLang("hi")}>हि</button>
          </div>
          <button
            className="icon-btn speak-btn"
            style={{ width: 36, height: 36, fontSize: ".75rem", background: voiceEnabled ? "var(--indigo-light)" : undefined, color: voiceEnabled ? "#fff" : undefined }}
            onClick={toggleVoice}
            title={voiceEnabled ? t.voiceOff2 : t.voiceOn}
          >
            {voiceEnabled ? "🔊" : "🔇"}
          </button>
          <button className="user-chip" onClick={() => router.push("/dashboard")}>← Back</button>
        </div>
      </nav>

      <div className="coach-layout">
        <div className="coach-section">
          {/* Voice mode banner */}
          {voiceEnabled && (
            <div className="voice-mode-banner">
              <div className="voice-wave">
                <span /><span /><span /><span /><span />
              </div>
              <span>Voice Mode Active • {lang === "hi" ? "हिन्दी" : "English"}</span>
              {speaking && (
                <span style={{ opacity: 0.8, fontSize: ".75rem" }}>
                  Coach is speaking...
                </span>
              )}
            </div>
          )}

          {/* Chat */}
          {chat.map((m, i) => (
            <div key={i} className={`msg ${m.who === "coach" ? "coach-m" : "user-m"}`}>
              {m.who === "coach" && <div className="avatar"><span /></div>}
              <div className="bubble">
                {m.text}
                {m.who === "coach" && speaking && i === chat.length - 1 && (
                  <span className="speaking-indicator">
                    <span className="mini-wave"><span /><span /><span /></span>
                    Speaking
                  </span>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="msg coach-m">
              <div className="avatar"><span /></div>
              <div className="bubble"><span className="typing"><i /><i /><i /></span></div>
            </div>
          )}
          {error && <div className="err">{error}</div>}

          {/* Demo selector (only at start) */}
          {chat.length <= 1 && !kit && !demoMode && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              {!showDemoSelector ? (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowDemoSelector(true)}>
                  ▶ {lang === "hi" ? "डेमो देखें (API की ज़रूरत नहीं)" : "Watch demos (no API needed)"}
                </button>
              ) : (
                <div style={{ background: "var(--sand)", borderRadius: 12, padding: 16, maxWidth: 340, margin: "0 auto" }}>
                  <div style={{ fontSize: ".85rem", fontWeight: 600, marginBottom: 12, color: "var(--ink)" }}>
                    {lang === "hi" ? "एक कहानी चुनें:" : "Choose a story:"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {DEMO_SCENARIOS.map((scenario) => (
                      <button
                        key={scenario.id}
                        onClick={() => startDemo(scenario)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 14px",
                          background: "#fff",
                          border: "1.5px solid var(--line)",
                          borderRadius: 8,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          textAlign: "left",
                          transition: "all .15s",
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--marigold)"; e.currentTarget.style.background = "var(--cream)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.background = "#fff"; }}
                      >
                        <span style={{ fontSize: "1.3rem" }}>{scenario.emoji}</span>
                        <span style={{ fontWeight: 600, fontSize: ".9rem", color: "var(--ink)" }}>
                          {lang === "hi" ? scenario.name_hi : scenario.name_en}
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowDemoSelector(false)}
                    style={{ marginTop: 12, fontSize: ".8rem", color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    {lang === "hi" ? "रद्द करें" : "Cancel"}
                  </button>
                </div>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Kit */}
        {kit && (
          <div className="kit">
            <div className="kit-head">
              <div className="eyebrow">{t.kitEyebrow}</div>
              <h3 className="serif">{t.kitTitle}</h3>
              {kit.motivation_message_en && (
                <div style={{ marginTop: 12, padding: "14px 16px", background: "linear-gradient(135deg, var(--marigold), var(--rose))", borderRadius: 12, fontSize: ".95rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.6 }}>
                  🦸‍♀️ {bi(kit.motivation_message_en, kit.motivation_message_hi)}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="kit-tabs">
              {TABS.map((tab, i) => (
                <button key={i} className={`kit-tab${kitTab === i ? " active" : ""}`} onClick={() => setKitTab(i)}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 0: Plan */}
            {kitTab === 0 && (
              <>
                <div className="card">
                  <h4>{t.cBiz}</h4>
                  {kit.businesses.map((b, i) => (
                    <div className="biz" key={i}>
                      <div className="name">{bi(b.name_en, b.name_hi)}</div>
                      <div className="range">{b.range}</div>
                      <div className="why">{bi(b.why_en, b.why_hi)}</div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <h4>{t.cPrice}</h4>
                  {kit.pricing.items.map((p, i) => (
                    <div className="price-line" key={i}><span>{bi(p.item_en, p.item_hi)}</span><b>{p.price}</b></div>
                  ))}
                  <div className="script"><b>{t.scriptLabel}</b><br />"{bi(kit.pricing.script_en, kit.pricing.script_hi)}"</div>
                </div>
                <div className="card">
                  <h4>{t.cWa}</h4>
                  <div className="wa-box">{bi(kit.whatsapp_en, kit.whatsapp_hi)}</div>
                  <button className="copy-btn" onClick={copyWa}>{copied ? t.copied : t.copy}</button>
                </div>
                <div className="card">
                  <h4>{t.cSchemes}</h4>
                  {kit.schemes.map((s, i) => (
                    <div className="scheme" key={i}>
                      <div className="dot" />
                      <div>
                        <div className="s-name">{s.name}</div>
                        <div className="s-what">{bi(s.what_en, s.what_hi)}</div>
                        <div className="s-step">→ {bi(s.step_en, s.step_hi)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card year-card">
                  <h4>{t.cYear}</h4>
                  <div className="year-row">
                    <div><div className="year-num">{kit.projection.monthly}</div><div className="year-label">{t.perMonth}</div></div>
                    <div><div className="year-num">{kit.projection.year}</div><div className="year-label">{t.perYear}</div></div>
                  </div>
                  <div className="year-assume">{bi(kit.projection.assumption_en, kit.projection.assumption_hi)}</div>
                  <div className="year-save"><b>{t.saveLabel}</b> {bi(kit.projection.savings_en, kit.projection.savings_hi)}</div>
                </div>
                <div className="card action-card">
                  <h4>{t.cAction}</h4>
                  <p>{bi(kit.action_en, kit.action_hi)}</p>
                </div>
              </>
            )}

            {/* Tab 1: Social Media (Instagram + FB Marketplace) */}
            {kitTab === 1 && (
              <>
                {/* Instagram Section */}
                {kit.instagram && (
                  <div className="card insta-card">
                    <h4>{t.cInsta}</h4>
                    <div style={{ marginBottom: 8, fontSize: ".8rem", color: "rgba(255,255,255,.7)" }}>Your Instagram bio:</div>
                    <div className="insta-bio">{bi(kit.instagram.bio_en, kit.instagram.bio_hi)}</div>
                    <div style={{ marginBottom: 8, fontSize: ".8rem", color: "rgba(255,255,255,.7)" }}>Post ideas to start:</div>
                    {kit.instagram.content_ideas_en?.map((idea, i) => (
                      <div className="insta-idea" key={i}>📸 {idea}</div>
                    ))}
                    {kit.instagram.hashtags && (
                      <div className="hashtag-wrap">
                        {kit.instagram.hashtags.map((h, i) => <span className="hashtag" key={i}>{h}</span>)}
                      </div>
                    )}
                    <button
                      className="ig-btn"
                      style={{ marginTop: 12 }}
                      onClick={() => window.open("https://www.instagram.com/accounts/login/", "_blank")}
                    >
                      📱 Create Instagram Page
                    </button>
                  </div>
                )}

                {/* FB Marketplace Section */}
                {kit.facebook_marketplace && (
                  <div className="card fb-card" style={{ marginTop: kit.instagram ? 16 : 0 }}>
                    <h4>{t.cFb}</h4>
                    {kit.facebook_marketplace.category && (
                      <div className="fb-category">📂 {kit.facebook_marketplace.category}</div>
                    )}
                    <div style={{ marginBottom: 8, fontSize: ".8rem", color: "rgba(255,255,255,.7)" }}>Your listing title:</div>
                    <div className="fb-listing-title">{bi(kit.facebook_marketplace.listing_title_en, kit.facebook_marketplace.listing_title_hi)}</div>
                    <div style={{ marginBottom: 8, fontSize: ".8rem", color: "rgba(255,255,255,.7)" }}>Listing description:</div>
                    <div className="fb-listing-desc">{bi(kit.facebook_marketplace.listing_description_en, kit.facebook_marketplace.listing_description_hi)}</div>
                    {kit.facebook_marketplace.photo_tips_en && (
                      <>
                        <div style={{ marginBottom: 8, fontSize: ".8rem", color: "rgba(255,255,255,.7)" }}>Photo tips:</div>
                        {kit.facebook_marketplace.photo_tips_en.map((tip, i) => (
                          <div className="fb-tip" key={i}>
                            <span className="fb-tip-icon">📷</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </>
                    )}
                    <button
                      className="fb-deep-link"
                      onClick={() => window.open("https://www.facebook.com/marketplace/create/item", "_blank")}
                    >
                      🛒 List on FB Marketplace
                    </button>
                  </div>
                )}

                {/* Fallback if neither exists */}
                {!kit.instagram && !kit.facebook_marketplace && (
                  <div className="card">
                    <p style={{ color: "var(--ink-soft)", fontSize: ".9rem", textAlign: "center" }}>
                      Ask your coach about social media setup in your next conversation!
                    </p>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                      <button
                        className="ig-btn"
                        onClick={() => window.open("https://www.instagram.com/accounts/login/", "_blank")}
                      >
                        📱 Create Instagram
                      </button>
                      <button
                        className="fb-deep-link"
                        onClick={() => window.open("https://www.facebook.com/marketplace/create/item", "_blank")}
                      >
                        🛒 FB Marketplace
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Tab 2: Sell & Ship - Marketplaces and Delivery */}
            {kitTab === 2 && (
              <>
                {/* Online Marketplaces */}
                <div className="card">
                  <h4>{t.cSell}</h4>
                  <p style={{ fontSize: ".85rem", color: "var(--ink-soft)", marginBottom: 16 }}>
                    {lang === "hi" ? "अपने प्रोडक्ट्स को इन प्लेटफॉर्म्स पर बेचें" : "Sell your products on these platforms"}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { name: "Meesho", desc: lang === "hi" ? "रीसेलिंग और अपने प्रोडक्ट्स बेचें" : "Resell or sell your own products", url: "https://meesho.com", icon: "🛍️", color: "#F43397" },
                      { name: "IndiaMart", desc: lang === "hi" ? "B2B बिज़नेस के लिए बेस्ट" : "Best for B2B wholesale business", url: "https://seller.indiamart.com", icon: "🏭", color: "#1A56DB" },
                      { name: "Amazon Seller", desc: lang === "hi" ? "देश भर में बेचें" : "Sell across India", url: "https://sell.amazon.in", icon: "📦", color: "#FF9900" },
                      { name: "Flipkart Seller", desc: lang === "hi" ? "करोड़ों ग्राहकों तक पहुंचें" : "Reach crores of customers", url: "https://seller.flipkart.com", icon: "🛒", color: "#2874F0" },
                      { name: "JioMart Partner", desc: lang === "hi" ? "लोकल डिलीवरी के लिए" : "For local delivery", url: "https://www.jiomart.com/seller", icon: "🏪", color: "#0A3D62" },
                    ].map((mp) => (
                      <div
                        key={mp.name}
                        onClick={() => window.open(mp.url, "_blank")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          background: "#fff",
                          border: "1px solid var(--line)",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: "1.5rem" }}>{mp.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{mp.name}</div>
                          <div style={{ fontSize: ".78rem", color: "var(--ink-soft)" }}>{mp.desc}</div>
                        </div>
                        <span style={{ fontSize: ".8rem", color: mp.color }}>→</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Partners */}
                <div className="card" style={{ marginTop: 16 }}>
                  <h4>{t.cShip}</h4>
                  <p style={{ fontSize: ".85rem", color: "var(--ink-soft)", marginBottom: 16 }}>
                    {lang === "hi" ? "अपने ऑर्डर्स कहीं भी भेजें" : "Ship your orders anywhere"}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { name: "Shiprocket", desc: lang === "hi" ? "सबसे सस्ती शिपिंग" : "Cheapest shipping rates", url: "https://www.shiprocket.in", icon: "🚀" },
                      { name: "Delhivery", desc: lang === "hi" ? "तेज़ डिलीवरी" : "Fast delivery", url: "https://www.delhivery.com", icon: "📬" },
                      { name: "BlueDart", desc: lang === "hi" ? "प्रीमियम सर्विस" : "Premium service", url: "https://www.bluedart.com", icon: "✈️" },
                      { name: "DTDC", desc: lang === "hi" ? "पूरे भारत में" : "Pan India coverage", url: "https://www.dtdc.in", icon: "🚚" },
                      { name: "India Post", desc: lang === "hi" ? "सबसे सस्ता विकल्प" : "Most affordable option", url: "https://www.indiapost.gov.in", icon: "📮" },
                    ].map((dp) => (
                      <div
                        key={dp.name}
                        onClick={() => window.open(dp.url, "_blank")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 14px",
                          background: "#fff",
                          border: "1px solid var(--line)",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: "1.5rem" }}>{dp.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{dp.name}</div>
                          <div style={{ fontSize: ".78rem", color: "var(--ink-soft)" }}>{dp.desc}</div>
                        </div>
                        <span style={{ fontSize: ".8rem", color: "var(--indigo)" }}>→</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Markets Tip */}
                <div className="card" style={{ marginTop: 16, background: "var(--sand)" }}>
                  <h4>📍 {lang === "hi" ? "लोकल मार्केट्स" : "Local Markets"}</h4>
                  <p style={{ fontSize: ".88rem", color: "var(--ink)", lineHeight: 1.6 }}>
                    {lang === "hi"
                      ? "अपने शहर की लोकल मंडी, हाट बाज़ार, और weekly markets में स्टॉल लगाकर भी बेच सकती हैं। शुरुआत में यह सबसे आसान तरीका है!"
                      : "You can also sell at your city's local mandis, haat bazaars, and weekly markets. This is the easiest way to start!"}
                  </p>
                </div>
              </>
            )}

            {/* Tab 3: Vendors */}
            {kitTab === 3 && (
              <div className="card">
                <h4>{t.cVendors}</h4>
                {kit.vendors?.map((v, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>{bi(v.category_en, v.category_hi)}</div>
                    {v.online?.map((o, j) => (
                      <div className="vendor-item" key={j}>
                        <div className="vendor-name">{o.name}</div>
                        <div className="vendor-what">{o.what_for}</div>
                      </div>
                    ))}
                    {v.local_tip_en && (
                      <div style={{ marginTop: 8, fontSize: ".85rem", color: "var(--leaf)", fontWeight: 600 }}>
                        📍 {bi(v.local_tip_en, v.local_tip_hi)}
                      </div>
                    )}
                  </div>
                ))}
                {!kit.vendors && <p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>Talk to your coach for vendor suggestions specific to your business!</p>}
              </div>
            )}

            {/* Tab 4: Business Tips */}
            {kitTab === 4 && kit.business_management && (
              <div className="card">
                <h4>{t.cMgmt}</h4>
                <div className="mgmt-row">
                  <div className="mgmt-label">📦 Inventory</div>
                  <div className="mgmt-text">{bi(kit.business_management.inventory_tip_en, kit.business_management.inventory_tip_hi)}</div>
                </div>
                <div className="mgmt-row">
                  <div className="mgmt-label">💰 Finance</div>
                  <div className="mgmt-text">{bi(kit.business_management.finance_tip_en, kit.business_management.finance_tip_hi)}</div>
                </div>
                <div className="mgmt-row">
                  <div className="mgmt-label">📅 First 7 Days</div>
                  <div className="mgmt-text">{bi(kit.business_management.first_week_en, kit.business_management.first_week_hi)}</div>
                </div>
              </div>
            )}
            {kitTab === 4 && !kit.business_management && (
              <div className="card"><p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>Business management tips will appear in your next coach session!</p></div>
            )}

            <div className="disclaimer">{t.disclaimer}</div>
            <button className="btn restart" onClick={() => window.location.reload()}>{t.restart}</button>
          </div>
        )}
      </div>

      {/* Input bar */}
      {!kit && (
        <div className="input-bar">
          {detectedLang !== "en-IN" && chat.length > 1 && (
            <div className="voice-bar" style={{ maxWidth: 640, margin: "0 auto 6px" }}>
              <span>Detected language:</span>
              <span className="lang-badge">{LANG_LABELS[detectedLang] || detectedLang}</span>
              <span style={{ marginLeft: "auto", fontSize: ".72rem" }}>Coach will respond in this language</span>
            </div>
          )}
          <div className="input-inner">
            <button className={`icon-btn mic-btn${listening ? " listening" : ""}`} onClick={toggleMic} title="Speak">🎤</button>
            <textarea
              rows={1}
              value={input}
              placeholder={t.placeholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
            />
            <button className="icon-btn send-btn" onClick={() => sendMsg()} title="Send">➤</button>
          </div>
        </div>
      )}
    </>
  );
}
