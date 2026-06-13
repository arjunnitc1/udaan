"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, addNotification } from "@/lib/auth";
import { DEMO_KIT, DEMO_SCRIPT } from "@/lib/demo";
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

function speak(text: string, langCode: string) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langCode;
  utt.rate = 0.92;
  utt.pitch = 1.05;
  const voices = synth.getVoices();
  const match = voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));
  if (match) utt.voice = match;
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
  cVendors: string; cMgmt: string; cAction: string; copy: string; copied: string;
  perMonth: string; perYear: string; scriptLabel: string; saveLabel: string; disclaimer: string;
  err: string; voiceOff: string; demoMode: string; voiceOn: string; voiceOff2: string;
  tabs: string[];
};
const UI: Record<Lang, UIStrings> = {
  en: {
    greeting: "Namaste! I'm Udaan — your business coach and biggest cheerleader. Tell me a little about yourself — where are you from, and who's at home with you? 🪁",
    placeholder: "Type or speak…",
    restart: "Start fresh",
    kitEyebrow: "YOUR UDAAN KIT",
    kitTitle: "Your business, ready to fly",
    cBiz: "What you can start",
    cPrice: "Your prices — counting YOUR time",
    cWa: "Your first WhatsApp message",
    cSchemes: "Government support for you",
    cYear: "Your possible year",
    cInsta: "Instagram setup",
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
    err: "The coach couldn't connect. Check your internet and try again.",
    voiceOff: "Voice not available in this browser — please use Chrome.",
    demoMode: "▶ Demo mode — Sunita's real Udaan journey",
    voiceOn: "🔊 Voice on",
    voiceOff2: "🔇 Voice off",
    tabs: ["Plan", "Instagram", "Vendors", "Business Tips"],
  },
  hi: {
    greeting: "नमस्ते! मैं उड़ान हूँ — आपकी बिज़नेस कोच और आपकी सबसे बड़ी हिम्मत। बताइए अपने बारे में — आप कहाँ रहती हैं, और घर में कौन-कौन है? 🪁",
    placeholder: "लिखें या बोलें…",
    restart: "नई शुरुआत",
    kitEyebrow: "आपकी उड़ान किट",
    kitTitle: "आपका बिज़नेस, उड़ान के लिए तैयार",
    cBiz: "आप क्या शुरू कर सकती हैं",
    cPrice: "आपके दाम — आपकी मेहनत गिनकर",
    cWa: "आपका पहला WhatsApp संदेश",
    cSchemes: "सरकारी योजनाएँ आपके लिए",
    cYear: "आपका संभावित साल",
    cInsta: "Instagram सेटअप",
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
    err: "कोच से कनेक्ट नहीं हो पाया। इंटरनेट जाँचें और फिर कोशिश करें।",
    voiceOff: "इस ब्राउज़र में वॉइस उपलब्ध नहीं — Chrome इस्तेमाल करें।",
    demoMode: "▶ डेमो — सुनीता की उड़ान यात्रा",
    voiceOn: "🔊 आवाज़ चालू",
    voiceOff2: "🔇 आवाज़ बंद",
    tabs: ["प्लान", "Instagram", "सामान", "बिज़नेस टिप्स"],
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
      if (voiceEnabled) speak(t.greeting, lang === "hi" ? "hi-IN" : "en-IN");
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

  async function startDemo() {
    setDemoMode(true);
    logEvent(sessionId.current, "session_start", { demo: true, lang });
    setChat([{ who: "coach", text: t.demoMode }]);
    for (const step of DEMO_SCRIPT) {
      await wait(1300);
      const text = lang === "hi" ? step.hi : step.en;
      setChat((c) => [...c, { who: step.who, text }]);
      if (voiceEnabled && step.who === "coach") speak(text, lang === "hi" ? "hi-IN" : "en-IN");
    }
    await wait(1100);
    setThinking(true);
    await wait(1700);
    setThinking(false);
    const introText = bi(DEMO_KIT.intro_en, DEMO_KIT.intro_hi);
    setChat((c) => [...c, { who: "coach", text: introText }]);
    if (voiceEnabled) speak(introText, lang === "hi" ? "hi-IN" : "en-IN");
    await wait(800);
    setKit(DEMO_KIT);
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
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      apiMessages.current.push({ role: "assistant", content: data.raw });
      setThinking(false);

      const reply = data.reply;
      if (reply.type === "question") {
        const msgText = bi(reply.text_en, reply.text_hi);
        setChat((c) => [...c, { who: "coach", text: msgText }]);
        if (voiceEnabled) speak(msgText, detected);
      } else if (reply.type === "kit") {
        const introText = bi(reply.intro_en, reply.intro_hi) || "🎉";
        setChat((c) => [...c, { who: "coach", text: introText }]);
        if (voiceEnabled) speak(introText, detected);
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
      console.error(e);
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
        body: "You're one tap away from your first customer. Send that message now — your first order is closer than you think!",
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
        <div className="brand" onClick={() => router.push("/dashboard")}>
          <div className="kite" />
          <h1 className="serif">Udaan<span className="hi">उड़ान</span></h1>
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
          <button className="user-chip" onClick={() => router.push("/dashboard")}>← Dashboard</button>
        </div>
      </nav>

      <div className="coach-layout">
        <div className="coach-section">
          {/* Chat */}
          {chat.map((m, i) => (
            <div key={i} className={`msg ${m.who === "coach" ? "coach-m" : "user-m"}`}>
              {m.who === "coach" && <div className="avatar"><span /></div>}
              <div className="bubble">{m.text}</div>
            </div>
          ))}
          {thinking && (
            <div className="msg coach-m">
              <div className="avatar"><span /></div>
              <div className="bubble"><span className="typing"><i /><i /><i /></span></div>
            </div>
          )}
          {error && <div className="err">{error}</div>}

          {/* Demo button (only at start) */}
          {chat.length <= 1 && !kit && !demoMode && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button className="btn btn-ghost btn-sm" onClick={startDemo}>▶ Watch Sunita&apos;s demo</button>
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

            {/* Tab 1: Instagram */}
            {kitTab === 1 && kit.instagram && (
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
              </div>
            )}
            {kitTab === 1 && !kit.instagram && (
              <div className="card"><p style={{ color: "var(--ink-soft)", fontSize: ".9rem" }}>Ask your coach about Instagram setup in your next conversation!</p></div>
            )}

            {/* Tab 2: Vendors */}
            {kitTab === 2 && (
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

            {/* Tab 3: Business Tips */}
            {kitTab === 3 && kit.business_management && (
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
            {kitTab === 3 && !kit.business_management && (
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
