"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AppNav from "@/components/AppNav";
import heroesData from "@/data/community-heroes.json";

type Hero = typeof heroesData.heroes[0];

export default function CommunityPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.replace("/auth");
  }, [isLoggedIn, isLoading, router]);

  const skills = ["All", ...Array.from(new Set(heroesData.heroes.map((h) => h.skill.split(" ")[0])))];
  const filtered = filter === "All" ? heroesData.heroes : heroesData.heroes.filter((h) => h.skill.startsWith(filter));

  if (isLoading || !isLoggedIn) return null;

  return (
    <>
      <AppNav />

      <div className="page-layout">
        <div className="page-header">
          <div className="eyebrow">Community Heroes</div>
          <h2 className="serif">Women who flew first 🏆</h2>
          <p>Real women who used Udaan to launch their businesses. Get inspired, or reach out directly. They&apos;ve been where you are.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {[
            { label: "Women helped", value: "10,000+" },
            { label: "Cities", value: "50+" },
            { label: "Avg monthly income", value: "₹16,500" },
            { label: "First order time", value: "~5 days" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)", padding: "12px 18px", flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>{s.value}</div>
              <div style={{ fontSize: ".72rem", color: "var(--ink-soft)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {skills.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "7px 16px", borderRadius: "99px", border: "1.5px solid",
                borderColor: filter === s ? "var(--marigold)" : "var(--line)",
                background: filter === s ? "var(--marigold)" : "#fff",
                color: filter === s ? "var(--ink)" : "var(--ink-soft)",
                fontWeight: 700, fontSize: ".8rem", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Hero cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((hero: Hero) => (
            <div key={hero.id} className="hero-card">
              <div className="hero-top">
                <div className="hero-avatar">{hero.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="hero-name">{hero.name}</div>
                  <div className="hero-loc">📍 {hero.location}</div>
                  <span className="hero-income">{hero.monthlyIncome}/month</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: ".72rem", color: "var(--ink-soft)", marginBottom: 4 }}>First order in</div>
                  <div style={{ fontWeight: 700, fontSize: ".88rem", color: "var(--rose)" }}>{hero.timeToFirstOrder}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                <span className="tag">{hero.skill}</span>
                <span className="tag">{hero.business}</span>
              </div>

              <div className="hero-quote">&ldquo;{hero.quote_en}&rdquo;</div>

              {expanded === hero.id && (
                <p style={{ fontSize: ".88rem", color: "var(--ink-soft)", lineHeight: 1.6, marginTop: 10 }}>
                  {hero.story_en}
                </p>
              )}

              <button
                onClick={() => setExpanded(expanded === hero.id ? null : hero.id)}
                style={{ background: "none", border: "none", color: "var(--indigo)", fontSize: ".82rem", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit", marginTop: 6, marginBottom: 10 }}
              >
                {expanded === hero.id ? "Show less ↑" : "Read her story ↓"}
              </button>

              <div className="hero-actions">
                <a href={`https://wa.me/${hero.whatsapp}?text=Hi%20${encodeURIComponent(hero.name)}!%20I%20found%20you%20on%20Udaan%20and%20would%20love%20to%20connect.`} target="_blank" rel="noreferrer">
                  <button className="wa-btn">
                    💬 WhatsApp her
                  </button>
                </a>
                <a href={`https://instagram.com/${hero.instagram.replace("@", "")}`} target="_blank" rel="noreferrer">
                  <button className="ig-btn">
                    📸 Instagram
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to coach */}
        <div style={{ marginTop: 32, background: "linear-gradient(135deg, var(--marigold), var(--rose))", borderRadius: "var(--radius)", padding: "28px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>🪁</div>
          <h3 className="serif" style={{ marginBottom: 8, fontSize: "1.3rem" }}>Your story could be next</h3>
          <p style={{ fontSize: ".9rem", color: "rgba(27,33,67,.75)", marginBottom: 20 }}>Every hero above started exactly where you are. Talk to your coach today.</p>
          <button className="btn btn-dark btn-sm" onClick={() => router.push("/coach")}>Talk to my coach →</button>
        </div>
      </div>
    </>
  );
}
