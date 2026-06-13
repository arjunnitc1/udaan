"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLang, AUTH_UI } from "@/lib/language";

const DUMMY_OTP = "123456";

export default function AuthPage() {
  const { login, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const t = AUTH_UI[lang];
  const [mode, setMode] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace("/dashboard");
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    if (mode === "name") {
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [mode]);

  function sendOtp() {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError(t.validMobile);
      return;
    }
    setError("");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setOtpSent(true);
      setMode("otp");
    }, 1200);
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (newOtp.every((d) => d)) verifyOtp(newOtp.join(""));
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function verifyOtp(code?: string) {
    const entered = code ?? otp.join("");
    if (entered.length < 6) return;
    setVerifying(true);
    setError("");
    setTimeout(() => {
      if (entered === DUMMY_OTP) {
        setVerifying(false);
        setMode("name");
      } else {
        setVerifying(false);
        setError(t.incorrectOtp);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    }, 900);
  }

  function completeSignup() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t.tellUsName);
      return;
    }
    setError("");
    login(phone, trimmedName);
    router.replace("/dashboard");
  }

  if (isLoading) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card kite-wrap">
          <div className="kite kite-lg" />
        </div>

        <h2 className="serif">
          {mode === "phone" ? t.welcomeToUdaan : mode === "otp" ? t.verifyNumber : t.almostThere}
        </h2>
        <p className="sub">
          {mode === "phone"
            ? t.tagline
            : mode === "otp"
            ? `${t.sentOtp} +91 ${phone}`
            : t.whatToCall}
        </p>

        {error && <div className="auth-error">{error}</div>}
        {otpSent && mode === "phone" && (
          <div className="auth-success">{t.otpSentTo} +91 {phone}</div>
        )}

        {mode === "phone" ? (
          <>
            <div className="phone-input-wrap">
              <span className="phone-prefix">🇮🇳 +91</span>
              <input
                type="tel"
                placeholder={t.enterMobile}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                autoFocus
                maxLength={10}
              />
            </div>
            <p className="auth-hint">{t.willReceiveOtp}</p>
            <button
              className="btn btn-primary full-width"
              onClick={sendOtp}
              disabled={sending}
            >
              {sending ? (
                <><span className="spinner" style={{ borderColor: "rgba(0,0,0,.15)", borderTopColor: "var(--ink)" }} /> {t.sending}</>
              ) : t.sendOtp}
            </button>
          </>
        ) : mode === "otp" ? (
          <>
            <div className="otp-wrap">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            <p className="auth-hint">{t.forDemo}</p>
            <button
              className="btn btn-primary full-width"
              onClick={() => verifyOtp()}
              disabled={verifying || otp.join("").length < 6}
            >
              {verifying ? (
                <><span className="spinner" style={{ borderColor: "rgba(0,0,0,.15)", borderTopColor: "var(--ink)" }} /> {t.verifying}</>
              ) : t.verifyAndContinue}
            </button>
            <div className="auth-divider">{t.or}</div>
            <button
              className="btn btn-ghost full-width"
              onClick={() => { setMode("phone"); setOtp(["","","","","",""]); setError(""); }}
            >
              {t.changeNumber}
            </button>
          </>
        ) : (
          <>
            <div className="phone-input-wrap" style={{ marginBottom: 14 }}>
              <input
                ref={nameRef}
                type="text"
                placeholder={t.yourName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && completeSignup()}
                style={{ paddingLeft: 16 }}
              />
            </div>
            <p className="auth-hint">{t.howCoachAddress}</p>
            <button
              className="btn btn-primary full-width"
              onClick={completeSignup}
              disabled={!name.trim()}
            >
              {t.letsBegin}
            </button>
          </>
        )}

        <p className="auth-toggle">
          {t.termsPrivacy}
        </p>
      </div>
    </div>
  );
}
