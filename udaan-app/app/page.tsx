"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_KIT, DEMO_SCRIPT } from "@/lib/demo";
import type { Kit } from "@/lib/types";

type Lang = "en" | "hi";
type Screen = "landing" | "coach" | "kit";
type ChatMsg = { who: "coach" | "user"; text: string };

const L = {
  en: {
    eyebrow: "AI BUSINESS COACH FOR WOMEN",
    sub: "Tell Udaan what you're good at — cooking, stitching, teaching, anything. Get your prices, your first customers' message, government support, and a picture of the life your skill can build. In your language. No judgement, ever.",
    cta: "Talk to your coach", demo: "▶ Watch Sunita's demo",
    trust: "Free forever for women · Works on any phone · Voice or typing",
    placeholder: "Tell me about your skill…", restart: "Start a new plan",
    kitEyebrow: "YOUR UDAAN KIT", kitTitle: "Your business, ready to fly",
    cBiz: "What you can start", cPrice: "Your prices — counting YOUR time",
    cWa: "Your first WhatsApp message", cSchemes: "Government support you qualify for",
    cYear: "Your possible year", cAction: "Do this today",
    copy: "Copy for WhatsApp", copied: "Copied ✓", perMonth: "per month", perYear: "in one year",
    scriptLabel: "How to say your price:", saveLabel: "Your first savings habit:",
    disclaimer: "Estimates are illustrative, not guarantees. Scheme details: verify on official portals. Udaan guides you; banks, SHG didis and officials help you complete each step.",
    err: "The coach couldn't connect. Check your internet, or watch Sunita's demo instead.",
    demoNote: "▶ Demo mode — a real conversation Udaan had with Sunita from Lucknow.",
    greeting: "Namaste! I'm Udaan — your business coach. Tell me, what are you good at? Speak or type, whatever feels easy. 🪁",
    voiceUnavailable: "Voice not available in this browser — please use Chrome.",
    chips: [
      { label: "🍱 I cook well", text: "I cook very well — everyone praises my food" },
      { label: "🪡 I stitch & tailor", text: "I stitch and tailor clothes at home" },
      { label: "📚 I can teach kids", text: "I can teach school children" },
      { label: "🌿 I do mehendi", text: "I do beautiful mehendi designs" },
    ],
  },
  hi: {
    eyebrow: "महिलाओं के लिए AI बिज़नेस कोच",
    sub: "उड़ान को बताइए आप क्या अच्छा करती हैं — खाना बनाना, सिलाई, पढ़ाना, कुछ भी। पाइए अपने दाम, पहला WhatsApp संदेश, सरकारी योजनाएँ, और उस ज़िंदगी की तस्वीर जो आपका हुनर बना सकता है। आपकी भाषा में। बिना किसी जजमेंट के।",
    cta: "अपने कोच से बात करें", demo: "▶ सुनीता का डेमो देखें",
    trust: "महिलाओं के लिए हमेशा मुफ़्त · किसी भी फ़ोन पर · बोलकर या लिखकर",
    placeholder: "अपने हुनर के बारे में बताइए…", restart: "नई योजना शुरू करें",
    kitEyebrow: "आपकी उड़ान किट", kitTitle: "आपका बिज़नेस, उड़ान के लिए तैयार",
    cBiz: "आप क्या शुरू कर सकती हैं", cPrice: "आपके दाम — आपकी मेहनत गिनकर",
    cWa: "आपका पहला WhatsApp संदेश", cSchemes: "सरकारी योजनाएँ जो आपके लिए हैं",
    cYear: "आपका संभावित साल", cAction: "आज ही करें",
    copy: "WhatsApp के लिए कॉपी करें", copied: "कॉपी हो गया ✓", perMonth: "हर महीने", perYear: "एक साल में",
    scriptLabel: "दाम बताने का तरीका:", saveLabel: "बचत की पहली आदत:",
    disclaimer: "अनुमान केवल उदाहरण हैं, गारंटी नहीं। योजना की जानकारी आधिकारिक पोर्टल पर जाँचें। उड़ान राह दिखाती है; बैंक, SHG दीदी और अधिकारी हर कदम पूरा करने में मदद करते हैं।",
    err: "कोच से कनेक्ट नहीं हो पाया। इंटरनेट जाँचें, या सुनीता का डेमो देखें।",
    demoNote: "▶ डेमो — लखनऊ की सुनीता से उड़ान की असली बातचीत।",
    greeting: "नमस्ते! मैं उड़ान हूँ — आपकी बिज़नेस कोच। बताइए, आप क्या अच्छा करती हैं? बोलकर या लिखकर, जैसे आपको आसान लगे। 🪁",
    voiceUnavailable: "इस ब्राउज़र में वॉइस उपलब्ध नहीं है — कृपया Chrome इस्तेमाल करें।",
    chips: [
      { label: "🍱 मैं अच्छा खाना बनाती हूँ", text: "मैं बहुत अच्छा खाना बनाती हूँ — सब मेरे खाने की तारीफ़ करते हैं" },
      { label: "🪡 मैं सिलाई करती हूँ", text: "मैं घर पर कपड़े सिलती हूँ" },
      { label: "📚 मैं बच्चों को पढ़ा सकती हूँ", text: "मैं स्कूल के बच्चों को पढ़ा सकती हूँ" },
      { label: "🌿 मैं मेहंदी लगाती हूँ", text: "मैं सुंदर मेहंदी लगाती हूँ" },
    ],
  },
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function logEvent(sessionId: string, type: string, payload?: unknown) {
  // Fire-and-forget funnel analytics. See app/api/session/route.ts.
  fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, type, payload }),
  }).catch(() => {});
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [screen, setScreen] = useState<Screen>("landing");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [kit, setKit] = useState<Kit | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const apiMessages = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const sessionId = useRef("s-" + Math.random().toString(36).slice(2, 10));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const t = L[lang];
  const bi = (en?: string, hi?: string) => (lang === "hi" ? hi || en || "" : en || hi || "");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, thinking, kit]);

  function startCoach(demo: boolean, prefill?: string) {
    setDemoMode(demo);
    setScreen("coach");
    logEvent(sessionId.current, "session_start", { demo, lang });
    if (demo) {
      runDemo();
    } else {
      setChat([{ who: "coach", text: t.greeting }]);
      if (prefill) {
        setTimeout(() => sendMsg(prefill), 500);
      }
    }
  }

  async function runDemo() {
    setChat([{ who: "coach", text: t.demoNote }]);
    for (const step of DEMO_SCRIPT) {
      await wait(1300);
      const text = lang === "hi" ? step.hi : step.en;
      setChat((c) => [...c, { who: step.who, text }]);
    }
    await wait(1100);
    setThinking(true);
    await wait(1700);
    setThinking(false);
    setChat((c) => [...c, { who: "coach", text: bi(DEMO_KIT.intro_en, DEMO_KIT.intro_hi) }]);
    await wait(800);
    setKit(DEMO_KIT);
    setScreen("kit");
    logEvent(sessionId.current, "kit_generated", { demo: true });
  }

  async function sendMsg(forced?: string) {
    const text = (forced ?? input).trim();
    if (!text || thinking) return;
    setInput("");
    setError("");
    setChat((c) => [...c, { who: "user", text }]);
    apiMessages.current.push({ role: "user", content: text });
    logEvent(sessionId.current, "interview_answer");
    setThinking(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages.current }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      apiMessages.current.push({ role: "assistant", content: data.raw });
      setThinking(false);
      const reply = data.reply;
      if (reply.type === "question") {
        setChat((c) => [...c, { who: "coach", text: bi(reply.text_en, reply.text_hi) }]);
      } else if (reply.type === "kit") {
        setChat((c) => [...c, { who: "coach", text: bi(reply.intro_en, reply.intro_hi) || "🎉" }]);
        await wait(700);
        setKit(reply as Kit);
        setScreen("kit");
        logEvent(sessionId.current, "kit_generated", { demo: false });
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
    if (!SR) { alert(t.voiceUnavailable); return; }
    if (recognition.current) { recognition.current.stop(); return; }
    const rec = new SR();
    rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = true;
    setListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setInput(Array.from(e.results).map((r: any) => r[0].transcript).join(""));
    };
    rec.onend = () => { setListening(false); recognition.current = null; };
    rec.onerror = () => { setListening(false); recognition.current = null; };
    recognition.current = rec;
    rec.start();
  }

  function copyWa() {
    if (!kit) return;
    const txt = bi(kit.whatsapp_en, kit.whatsapp_hi);
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      logEvent(sessionId.current, "whatsapp_copied");
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <>
      <header>
        <div className="brand">
          <div className="kite" />
          <h1 className="serif">Udaan<span className="hi">उड़ान</span></h1>
        </div>
        <div className="lang-toggle">
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button>
          <button className={lang === "hi" ? "active" : ""} onClick={() => setLang("hi")}>हिन्दी</button>
        </div>
      </header>

      {screen === "landing" && (
        <section className="landing">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2 className="serif">
            {lang === "en" ? (
              <>You already have the skill.<br /><em>Let&apos;s build the business.</em></>
            ) : (
              <>हुनर तो आपके पास पहले से है।<br /><em>चलिए बिज़नेस बनाते हैं।</em></>
            )}
          </h2>
          <p className="sub">{t.sub}</p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => startCoach(false)}>{t.cta}</button>
            <button className="btn btn-ghost" onClick={() => startCoach(true)}>{t.demo}</button>
          </div>
          <div className="trust">{t.trust}</div>
          <div className="skill-chips">
            {t.chips.map((c) => (
              <button key={c.label} className="chip" onClick={() => startCoach(false, c.text)}>{c.label}</button>
            ))}
          </div>
        </section>
      )}

      {(screen === "coach" || screen === "kit") && (
        <section className="coach">
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
          <div ref={bottomRef} />
        </section>
      )}

      {screen === "coach" && !demoMode && (
        <div className="input-bar">
          <div className="input-inner">
            <button className={`icon-btn mic-btn ${listening ? "listening" : ""}`} onClick={toggleMic} title="Speak">🎤</button>
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

      {screen === "kit" && kit && (
        <section className="kit" style={{ display: "block" }}>
          <div className="kit-head">
            <div className="eyebrow">{t.kitEyebrow}</div>
            <h3 className="serif">{t.kitTitle}</h3>
          </div>

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
            <div className="script">
              <b>{t.scriptLabel}</b><br />“{bi(kit.pricing.script_en, kit.pricing.script_hi)}”
            </div>
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

          <div className="disclaimer">{t.disclaimer}</div>
          <button className="btn restart" onClick={() => window.location.reload()}>{t.restart}</button>
        </section>
      )}
    </>
  );
}
