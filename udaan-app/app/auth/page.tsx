"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const DUMMY_OTP = "123456";

export default function AuthPage() {
  const { login, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace("/dashboard");
  }, [isLoggedIn, isLoading, router]);

  function sendOtp() {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
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
        login(phone);
        router.replace("/dashboard");
      } else {
        setVerifying(false);
        setError("Incorrect OTP. (Hint: use 123456)");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    }, 900);
  }

  if (isLoading) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card kite-wrap">
          <div className="kite kite-lg" />
        </div>

        <h2 className="serif">
          {mode === "phone" ? "Welcome to Udaan" : "Verify your number"}
        </h2>
        <p className="sub">
          {mode === "phone"
            ? "उड़ान — Your skill. Your business. Your flight.\nEnter your mobile number to get started."
            : `We sent a 6-digit OTP to +91 ${phone}`}
        </p>

        {error && <div className="auth-error">{error}</div>}
        {otpSent && mode === "phone" && (
          <div className="auth-success">OTP sent to +91 {phone}</div>
        )}

        {mode === "phone" ? (
          <>
            <div className="phone-input-wrap">
              <span className="phone-prefix">🇮🇳 +91</span>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                autoFocus
                maxLength={10}
              />
            </div>
            <p className="auth-hint">You will receive a one-time password via SMS</p>
            <button
              className="btn btn-primary full-width"
              onClick={sendOtp}
              disabled={sending}
            >
              {sending ? (
                <><span className="spinner" style={{ borderColor: "rgba(0,0,0,.15)", borderTopColor: "var(--ink)" }} /> Sending…</>
              ) : "Send OTP"}
            </button>
          </>
        ) : (
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
            <p className="auth-hint">For demo, enter: 1 2 3 4 5 6</p>
            <button
              className="btn btn-primary full-width"
              onClick={() => verifyOtp()}
              disabled={verifying || otp.join("").length < 6}
            >
              {verifying ? (
                <><span className="spinner" style={{ borderColor: "rgba(0,0,0,.15)", borderTopColor: "var(--ink)" }} /> Verifying…</>
              ) : "Verify & Continue"}
            </button>
            <div className="auth-divider">or</div>
            <button
              className="btn btn-ghost full-width"
              onClick={() => { setMode("phone"); setOtp(["","","","","",""]); setError(""); }}
            >
              Change number
            </button>
          </>
        )}

        <p className="auth-toggle">
          By continuing, you agree to Udaan&apos;s{" "}
          <button onClick={() => {}}>Terms & Privacy</button>
        </p>
      </div>
    </div>
  );
}
