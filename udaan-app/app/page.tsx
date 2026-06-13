"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import heroesData from "@/data/community-heroes.json";

type Lang = "en" | "hi";

const L = {
  en: {
    eyebrow: "AI BUSINESS COACH FOR WOMEN",
    headline1: "You already have the skill.",
    headline2: "Let's build the business.",
    sub: "Tell Udaan what you're good at: cooking, stitching, teaching, mehendi, anything. Get your prices, your first WhatsApp message, government support, and a picture of the life your skill can build. In your language. Judgment-free, always.",
    cta: "Start your journey",
    demo: "▶ Watch Sunita's demo",
    trust: "Free forever for women · Works on any phone · Voice or typing · Hindi & 5 more languages",
    how: "How it works",
    step1t: "Share your skill", step1d: "Tell Udaan what you do: cooking, stitching, teaching, crafts, beauty, anything.",
    step2t: "Get your plan", step2d: "Udaan builds your personalised business kit: prices, WhatsApp message, government schemes.",
    step3t: "Start earning", step3d: "Set goals, track savings, connect with community heroes who've done it.",
    heroesTitle: "Meet the women who flew first",
    heroesSub: "Real women, real businesses, real results. Powered by Udaan.",
    ctaBottom: "Ready to write your story?",
    ctaBottomSub: "Join 10,000+ women who started with one tap.",
    ctaBtn: "Get started for free",
    chips: [
      { label: "🍱 I cook well", text: "I cook very well, everyone praises my food" },
      { label: "🪡 I stitch & tailor", text: "I stitch and tailor clothes at home" },
      { label: "📚 I can teach kids", text: "I can teach school children" },
      { label: "🌿 I do mehendi", text: "I do beautiful mehendi designs" },
      { label: "✨ Other skills", text: "I have other skills I want to turn into a business" },
    ],
  },
  hi: {
    eyebrow: "महिलाओं के लिए AI बिज़नेस कोच",
    headline1: "हुनर तो आपके पास है।",
    headline2: "चलिए बिज़नेस बनाते हैं।",
    sub: "उड़ान को बताइए आप क्या अच्छा करती हैं: खाना, सिलाई, पढ़ाना, मेहंदी, कुछ भी। पाइए दाम, पहला WhatsApp संदेश, सरकारी योजनाएँ। आपकी भाषा में। बिना किसी जजमेंट के।",
    cta: "अपनी उड़ान शुरू करें",
    demo: "▶ सुनीता का डेमो देखें",
    trust: "महिलाओं के लिए हमेशा मुफ़्त · किसी भी फ़ोन पर · बोलकर या लिखकर · हिंदी और 5 भाषाओं में",
    how: "कैसे काम करता है",
    step1t: "अपना हुनर बताएँ", step1d: "उड़ान को बताइए आप क्या करती हैं: खाना, सिलाई, पढ़ाई, हस्तकला, सौंदर्य, कुछ भी।",
    step2t: "अपनी किट पाएँ", step2d: "उड़ान बनाती है आपकी किट: दाम, WhatsApp संदेश, सरकारी योजनाएँ।",
    step3t: "कमाई शुरू करें", step3d: "लक्ष्य बनाएँ, बचत ट्रैक करें, उन दीदियों से जुड़ें जिन्होंने यह कर दिखाया।",
    heroesTitle: "उन दीदियों से मिलिए जो उड़ गईं",
    heroesSub: "असली महिलाएँ, असली बिज़नेस, असली नतीजे। उड़ान की मदद से।",
    ctaBottom: "क्या आप तैयार हैं अपनी कहानी लिखने के लिए?",
    ctaBottomSub: "10,000+ महिलाएँ एक टैप से शुरू हुईं।",
    ctaBtn: "शुरू करें, बिल्कुल मुफ़्त",
    chips: [
      { label: "🍱 मैं अच्छा खाना बनाती हूँ", text: "मैं बहुत अच्छा खाना बनाती हूँ" },
      { label: "🪡 मैं सिलाई करती हूँ", text: "मैं घर पर कपड़े सिलती हूँ" },
      { label: "📚 मैं बच्चों को पढ़ा सकती हूँ", text: "मैं स्कूल के बच्चों को पढ़ाती हूँ" },
      { label: "🌿 मैं मेहंदी लगाती हूँ", text: "मैं सुंदर मेहंदी लगाती हूँ" },
      { label: "✨ अन्य कौशल", text: "मेरे पास अन्य कौशल हैं जिन्हें मैं बिज़नेस में बदलना चाहती हूँ" },
    ],
  },
};

export default function LandingPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const t = L[lang];

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace("/dashboard");
  }, [isLoggedIn, isLoading, router]);

  function go(prefill?: string) {
    if (prefill) {
      sessionStorage.setItem("udaan_prefill", prefill);
    }
    router.push("/auth");
  }

  if (isLoading) return null;

  const previewHeroes = heroesData.heroes.slice(0, 3);

  return (
    <>
      {/* Header */}
      <header className="pub">
        <div className="brand" onClick={() => {}}>
          <div className="kite" />
          <h1 className="serif">Udaan<span className="hi">उड़ान</span></h1>
        </div>
        <div className="pub-nav">
          <div className="lang-toggle">
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button>
            <button className={lang === "hi" ? "active" : ""} onClick={() => setLang("hi")}>हिन्दी</button>
          </div>
          <button className="btn btn-dark btn-sm" style={{ marginLeft: 8 }} onClick={() => router.push("/auth")}>
            Sign in
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2 className="serif">
            {t.headline1}<br /><em>{t.headline2}</em>
          </h2>
          <p className="sub">{t.sub}</p>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={() => go()}>{t.cta}</button>
            <button className="btn btn-ghost-light" onClick={() => router.push("/demo")}>{t.demo}</button>
          </div>
          <div className="trust">{t.trust}</div>
          <div className="skill-chips">
            {t.chips.map((c) => (
              <button key={c.label} className="chip" onClick={() => go(c.text)}>{c.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        {[
          { num: "10,000+", label: lang === "hi" ? "महिलाएँ" : "Women helped" },
          { num: "50+", label: lang === "hi" ? "शहर" : "Cities" },
          { num: "₹16,500", label: lang === "hi" ? "औसत मासिक आय" : "Avg monthly income" },
          { num: "~5 days", label: lang === "hi" ? "पहला ऑर्डर" : "To first order" },
        ].map((s) => (
          <div key={s.label} className="stat-item">
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <section className="how-it-works">
        <div className="section-eyebrow">{t.how}</div>
        <h3 className="serif section-title">
          {lang === "hi" ? "तीन कदम, एक नई ज़िंदगी" : "Three steps. A new life."}
        </h3>
        <div className="steps">
          {[
            { icon: "💬", num: "1", title: t.step1t, desc: t.step1d },
            { icon: "📋", num: "2", title: t.step2t, desc: t.step2d },
            { icon: "🚀", num: "3", title: t.step3t, desc: t.step3d },
          ].map((s) => (
            <div key={s.num} className="step-card">
              <div className="step-icon">{s.icon}</div>
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Community heroes preview */}
      <section className="heroes-preview">
        <div className="heroes-preview-inner">
          <div className="section-eyebrow" style={{ textAlign: "center" }}>
            {lang === "hi" ? "सामुदायिक हीरो" : "Community Heroes"}
          </div>
          <h3 className="serif section-title">{t.heroesTitle}</h3>
          <p style={{ textAlign: "center", color: "var(--ink-soft)", marginTop: -24, marginBottom: 32 }}>{t.heroesSub}</p>
          <div className="preview-grid">
            {previewHeroes.map((h) => (
              <div key={h.id} className="hero-card">
                <div className="hero-top">
                  <div className="hero-avatar">{h.emoji}</div>
                  <div>
                    <div className="hero-name">{h.name}</div>
                    <div className="hero-loc">{h.location}</div>
                    <span className="hero-income">{h.monthlyIncome}/mo</span>
                  </div>
                </div>
                <div className="hero-quote">&ldquo;{lang === "hi" ? h.quote_hi : h.quote_en}&rdquo;</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  <span className="tag">{h.skill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages strip */}
      <div style={{ background: "var(--sand)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "18px 24px", textAlign: "center" }}>
        <div style={{ fontSize: ".78rem", color: "var(--ink-soft)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>
          {lang === "hi" ? "आपकी भाषा में काम करता है" : "Works in your language"}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {["English", "हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "বাংলা"].map((l) => (
            <span key={l} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "99px", padding: "5px 14px", fontSize: ".85rem", fontWeight: 600 }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="landing-cta">
        <h3 className="serif">{t.ctaBottom}</h3>
        <p>{t.ctaBottomSub}</p>
        <button className="btn btn-dark" onClick={() => go()}>{t.ctaBtn} →</button>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px", textAlign: "center", fontSize: ".78rem", color: "var(--ink-soft)", borderTop: "1px solid var(--line)" }}>
        <p>Udaan (उड़ान) · Built for Indian women · Judgment-free, always</p>
        <p style={{ marginTop: 6 }}>Built at AI for Good Hackathon, Oxford, June 2026</p>
      </footer>
    </>
  );
}
