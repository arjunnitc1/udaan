"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_KIT, DEMO_SCRIPT } from "@/lib/demo";
import type { Kit } from "@/lib/types";

type Lang = "en" | "hi";
type ChatMsg = { who: "coach" | "user"; text: string };

function speak(text: string, langCode: string, onStart?: () => void, onEnd?: () => void) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langCode;
  utt.rate = 0.92;
  utt.pitch = 1.05;

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

const UI: Record<Lang, { demoTitle: string; demoSub: string; signUp: string; restart: string; tabs: string[] }> = {
  en: {
    demoTitle: "Watch Sunita's Journey",
    demoSub: "See how Sunita used Udaan to start her tiffin business",
    signUp: "Start your own journey",
    restart: "Watch again",
    tabs: ["Plan", "Social Media", "Vendors", "Business Tips"],
  },
  hi: {
    demoTitle: "सुनीता की यात्रा देखें",
    demoSub: "देखिए कैसे सुनीता ने उड़ान से अपना टिफ़िन बिज़नेस शुरू किया",
    signUp: "अपनी यात्रा शुरू करें",
    restart: "फिर से देखें",
    tabs: ["प्लान", "सोशल मीडिया", "सामान", "बिज़नेस टिप्स"],
  },
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function DemoPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [kit, setKit] = useState<Kit | null>(null);
  const [kitTab, setKitTab] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const t = UI[lang];
  const bi = (en?: string, hi?: string) => (lang === "hi" ? hi || en || "" : en || hi || "");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, thinking, kit]);

  async function startDemo() {
    setDemoStarted(true);
    setDemoComplete(false);
    setKit(null);
    setChat([]);

    const greeting = lang === "hi"
      ? "नमस्ते! मैं उड़ान हूँ। आइए देखते हैं कैसे सुनीता ने अपना बिज़नेस शुरू किया। 🪁"
      : "Namaste! I'm Udaan. Let's see how Sunita started her business. 🪁";

    setChat([{ who: "coach", text: greeting }]);
    if (voiceEnabled) {
      speak(greeting, lang === "hi" ? "hi-IN" : "en-IN", () => setSpeaking(true), () => setSpeaking(false));
    }

    await wait(1500);

    for (const step of DEMO_SCRIPT) {
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

    const introText = bi(DEMO_KIT.intro_en, DEMO_KIT.intro_hi);
    setChat((c) => [...c, { who: "coach", text: introText }]);
    if (voiceEnabled) {
      speak(introText, lang === "hi" ? "hi-IN" : "en-IN", () => setSpeaking(true), () => setSpeaking(false));
    }

    await wait(800);
    setKit(DEMO_KIT);
    setDemoComplete(true);
  }

  function toggleVoice() {
    if (voiceEnabled) { window.speechSynthesis?.cancel(); setSpeaking(false); }
    setVoiceEnabled(!voiceEnabled);
  }

  return (
    <>
      {/* Header */}
      <nav className="app-nav">
        <div className="brand" onClick={() => router.push("/")}>
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
          >
            {voiceEnabled ? "🔊" : "🔇"}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => router.push("/auth")}>
            {t.signUp}
          </button>
        </div>
      </nav>

      <div className="coach-layout">
        <div className="coach-section">
          {/* Demo intro */}
          {!demoStarted && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>🪁</div>
              <h2 className="serif" style={{ fontSize: "1.8rem", marginBottom: 12 }}>{t.demoTitle}</h2>
              <p style={{ color: "var(--ink-soft)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>{t.demoSub}</p>
              <button className="btn btn-primary" onClick={startDemo}>
                ▶ {lang === "hi" ? "डेमो शुरू करें" : "Start Demo"}
              </button>
            </div>
          )}

          {/* Voice mode banner */}
          {demoStarted && voiceEnabled && (
            <div className="voice-mode-banner">
              <div className="voice-wave">
                <span /><span /><span /><span /><span />
              </div>
              <span>Voice Mode Active</span>
              {speaking && <span style={{ opacity: 0.8, fontSize: ".75rem" }}>Speaking...</span>}
            </div>
          )}

          {/* Chat */}
          {demoStarted && chat.map((m, i) => (
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

          <div ref={bottomRef} />
        </div>

        {/* Kit */}
        {kit && (
          <div className="kit">
            <div className="kit-head">
              <div className="eyebrow">{lang === "hi" ? "सुनीता की उड़ान किट" : "SUNITA'S UDAAN KIT"}</div>
              <h3 className="serif">{lang === "hi" ? "सुनीता का बिज़नेस प्लान" : "Sunita's Business Plan"}</h3>
              {kit.motivation_message_en && (
                <div style={{ marginTop: 12, padding: "14px 16px", background: "linear-gradient(135deg, var(--marigold), var(--rose))", borderRadius: 12, fontSize: ".95rem", fontWeight: 600, color: "var(--ink)", lineHeight: 1.6 }}>
                  🦸‍♀️ {bi(kit.motivation_message_en, kit.motivation_message_hi)}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="kit-tabs">
              {t.tabs.map((tab, i) => (
                <button key={i} className={`kit-tab${kitTab === i ? " active" : ""}`} onClick={() => setKitTab(i)}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 0: Plan */}
            {kitTab === 0 && (
              <>
                <div className="card">
                  <h4>{lang === "hi" ? "बिज़नेस आइडिया" : "Business Ideas"}</h4>
                  {kit.businesses.map((b, i) => (
                    <div className="biz" key={i}>
                      <div className="name">{bi(b.name_en, b.name_hi)}</div>
                      <div className="range">{b.range}</div>
                      <div className="why">{bi(b.why_en, b.why_hi)}</div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <h4>{lang === "hi" ? "प्राइसिंग" : "Pricing"}</h4>
                  {kit.pricing.items.map((p, i) => (
                    <div className="price-line" key={i}><span>{bi(p.item_en, p.item_hi)}</span><b>{p.price}</b></div>
                  ))}
                </div>
                <div className="card">
                  <h4>{lang === "hi" ? "WhatsApp संदेश" : "WhatsApp Message"}</h4>
                  <div className="wa-box">{bi(kit.whatsapp_en, kit.whatsapp_hi)}</div>
                </div>
                <div className="card">
                  <h4>{lang === "hi" ? "सरकारी योजनाएँ" : "Government Schemes"}</h4>
                  {kit.schemes.map((s, i) => (
                    <div className="scheme" key={i}>
                      <div className="dot" />
                      <div>
                        <div className="s-name">{s.name}</div>
                        <div className="s-what">{bi(s.what_en, s.what_hi)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Other tabs simplified for demo */}
            {kitTab === 1 && (
              <div className="card">
                <h4>{lang === "hi" ? "सोशल मीडिया" : "Social Media"}</h4>
                <p style={{ color: "var(--ink-soft)" }}>
                  {lang === "hi"
                    ? "साइन अप करें और अपना Instagram और Facebook Marketplace सेटअप पाएं!"
                    : "Sign up to get your personalized Instagram and Facebook Marketplace setup!"}
                </p>
              </div>
            )}

            {kitTab === 2 && (
              <div className="card">
                <h4>{lang === "hi" ? "सामान कहाँ से लें" : "Where to Source"}</h4>
                <p style={{ color: "var(--ink-soft)" }}>
                  {lang === "hi"
                    ? "साइन अप करें और अपने एरिया के vendors की जानकारी पाएं!"
                    : "Sign up to get vendor recommendations for your area!"}
                </p>
              </div>
            )}

            {kitTab === 3 && (
              <div className="card">
                <h4>{lang === "hi" ? "बिज़नेस टिप्स" : "Business Tips"}</h4>
                <p style={{ color: "var(--ink-soft)" }}>
                  {lang === "hi"
                    ? "साइन अप करें और अपने बिज़नेस के लिए detailed tips पाएं!"
                    : "Sign up to get detailed business management tips!"}
                </p>
              </div>
            )}

            {/* CTA */}
            {demoComplete && (
              <div style={{ marginTop: 20 }}>
                <button className="btn btn-primary full-width" onClick={() => router.push("/auth")}>
                  {t.signUp} →
                </button>
                <button className="btn btn-ghost full-width" style={{ marginTop: 8 }} onClick={() => { setDemoStarted(false); setKit(null); setChat([]); }}>
                  {t.restart}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
