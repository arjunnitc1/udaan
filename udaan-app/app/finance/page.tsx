"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AppNav from "@/components/AppNav";
import { useLang, FINANCE_UI } from "@/lib/language";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: number;
  imageData?: string; // Base64 image data for bill scan
};

const INCOME_CATEGORIES = ["Sales", "Services", "Orders", "Other Income"];
const EXPENSE_CATEGORIES = ["Materials", "Transport", "Phone/Data", "Equipment", "Other Expense"];
const STORAGE_KEY = "udaan_transactions";

// Keywords for detecting transaction type from voice
const INCOME_KEYWORDS = ["sold", "earned", "received", "got", "income", "payment", "order", "बेचा", "कमाया", "मिला", "आया", "आमदनी"];
const EXPENSE_KEYWORDS = ["spent", "paid", "bought", "expense", "cost", "खर्च", "दिया", "खरीदा", "लगा"];

// Parse voice input to extract transaction details
function parseVoiceInput(text: string): { type: "income" | "expense"; amount: number; description: string; category: string } | null {
  const lowerText = text.toLowerCase();

  // Detect type
  let type: "income" | "expense" = "income";
  if (EXPENSE_KEYWORDS.some(k => lowerText.includes(k))) {
    type = "expense";
  } else if (INCOME_KEYWORDS.some(k => lowerText.includes(k))) {
    type = "income";
  }

  // Extract amount (look for numbers with optional rupee symbol)
  const amountMatch = text.match(/₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)|(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:rupees?|rs\.?|रुपये|रुपए)/i);
  if (!amountMatch) {
    // Try to find any number
    const numMatch = text.match(/\d+/);
    if (!numMatch) return null;
    const amount = parseFloat(numMatch[0].replace(/,/g, ""));
    return {
      type,
      amount,
      description: text,
      category: type === "income" ? "Sales" : "Other Expense",
    };
  }

  const amount = parseFloat((amountMatch[1] || amountMatch[2]).replace(/,/g, ""));
  if (isNaN(amount) || amount <= 0) return null;

  // Detect category based on keywords
  let category = type === "income" ? "Sales" : "Other Expense";
  if (type === "income") {
    if (/order|आर्डर/i.test(lowerText)) category = "Orders";
    else if (/service|सेवा/i.test(lowerText)) category = "Services";
  } else {
    if (/transport|travel|auto|taxi|bus|train|यातायात|ऑटो/i.test(lowerText)) category = "Transport";
    else if (/material|सामान|raw/i.test(lowerText)) category = "Materials";
    else if (/phone|mobile|data|recharge|फोन|रिचार्ज/i.test(lowerText)) category = "Phone/Data";
    else if (/equipment|machine|tool|मशीन/i.test(lowerText)) category = "Equipment";
  }

  return {
    type,
    amount,
    description: text,
    category,
  };
}

function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveTransactions(txns: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function FinancePage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const t = FINANCE_UI[lang];
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [txnType, setTxnType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "income" | "expense">("all");
  const [billImage, setBillImage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceParsed, setVoiceParsed] = useState<ReturnType<typeof parseVoiceInput>>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) { router.replace("/auth"); return; }
    if (isLoggedIn) {
      setTransactions(getTransactions());
    }
  }, [isLoggedIn, isLoading, router]);

  function handleImageCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setBillImage(imageData);
      setIsProcessingImage(false);
      // In a real app, you would send this to an OCR API
      // For now, we'll just store the image
    };
    reader.readAsDataURL(file);
  }

  function addTransaction() {
    if (!amount || !category) return;
    const newTxn: Transaction = {
      id: Math.random().toString(36).slice(2),
      type: txnType,
      amount: parseFloat(amount),
      category,
      description,
      date: Date.now(),
      imageData: billImage || undefined,
    };
    const updated = [newTxn, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setShowAddModal(false);
    setAmount("");
    setCategory("");
    setDescription("");
    setBillImage(null);
  }

  function deleteTransaction(id: string) {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  }

  // Voice recognition functions
  function startVoiceInput() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert(lang === "hi" ? "आपके ब्राउज़र में वॉइस सपोर्ट नहीं है। Chrome इस्तेमाल करें।" : "Voice not supported in this browser. Please use Chrome.");
      return;
    }

    setShowVoiceModal(true);
    setVoiceText("");
    setVoiceParsed(null);

    const rec = new SR();
    rec.lang = lang === "hi" ? "hi-IN" : lang === "bn" ? "bn-IN" : lang === "ml" ? "ml-IN" : "en-IN";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onstart = () => setIsListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join("");
      setVoiceText(transcript);

      // Parse on final result
      if (e.results[e.results.length - 1].isFinal) {
        const parsed = parseVoiceInput(transcript);
        setVoiceParsed(parsed);
      }
    };

    rec.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    rec.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = rec;
    rec.start();
  }

  function stopVoiceInput() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }

  function confirmVoiceTransaction() {
    if (!voiceParsed) return;
    const newTxn: Transaction = {
      id: Math.random().toString(36).slice(2),
      type: voiceParsed.type,
      amount: voiceParsed.amount,
      category: voiceParsed.category,
      description: voiceParsed.description,
      date: Date.now(),
    };
    const updated = [newTxn, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setShowVoiceModal(false);
    setVoiceText("");
    setVoiceParsed(null);
  }

  if (isLoading || !isLoggedIn) return null;

  // Calculate stats
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Filter transactions based on view mode
  const filteredTxns = viewMode === "all"
    ? transactions
    : transactions.filter((t) => t.type === viewMode);

  // Get this month's stats
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const monthlyIncome = monthlyTxns.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = monthlyTxns.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  const displayName = user?.name || "Didi";

  return (
    <>
      <AppNav />

      <div className="page-layout">
        <div className="page-header">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2 className="serif">{t.title}, {displayName}! 💰</h2>
          <p>{t.subtitle}</p>
        </div>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          <div style={{ background: "#EAF7EE", borderRadius: "var(--radius)", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: ".75rem", color: "var(--leaf)", fontWeight: 700, marginBottom: 4 }}>{t.totalIncome}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--leaf)" }}>₹{totalIncome.toLocaleString("en-IN")}</div>
          </div>
          <div style={{ background: "#FBEAEA", borderRadius: "var(--radius)", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: ".75rem", color: "#8A2B2B", fontWeight: 700, marginBottom: 4 }}>{t.totalExpense}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#8A2B2B" }}>₹{totalExpense.toLocaleString("en-IN")}</div>
          </div>
          <div style={{ background: netProfit >= 0 ? "linear-gradient(135deg, var(--marigold), var(--rose))" : "#FEF3C7", borderRadius: "var(--radius)", padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: ".75rem", color: "var(--ink)", fontWeight: 700, marginBottom: 4 }}>{t.netProfit}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--ink)" }}>₹{netProfit.toLocaleString("en-IN")}</div>
          </div>
        </div>

        {/* This month's summary */}
        <div className="dash-card" style={{ marginBottom: 20, background: "linear-gradient(135deg, var(--ink) 0%, #2A3160 100%)", color: "var(--paper)" }}>
          <div style={{ fontSize: ".75rem", color: "var(--marigold)", fontWeight: 700, marginBottom: 12 }}>{t.thisMonth}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: ".8rem", opacity: 0.7 }}>{t.income}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#4ADE80" }}>+₹{monthlyIncome.toLocaleString("en-IN")}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: ".8rem", opacity: 0.7 }}>{t.expense}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#F87171" }}>-₹{monthlyExpense.toLocaleString("en-IN")}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: ".8rem", opacity: 0.7 }}>{t.net}</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--marigold)" }}>₹{(monthlyIncome - monthlyExpense).toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        {/* Add transaction buttons */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => { setTxnType("income"); setShowAddModal(true); }}
          >
            {t.addIncome}
          </button>
          <button
            className="btn btn-ghost"
            style={{ flex: 1 }}
            onClick={() => { setTxnType("expense"); setShowAddModal(true); }}
          >
            {t.addExpense}
          </button>
        </div>

        {/* Voice entry button */}
        <button
          onClick={startVoiceInput}
          style={{
            width: "100%",
            padding: "14px 20px",
            marginBottom: 20,
            background: "linear-gradient(135deg, var(--indigo-light), var(--indigo))",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius)",
            fontSize: ".95rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🎤</span>
          {t.speakToAdd}
        </button>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { key: "all", label: t.all },
            { key: "income", label: t.income },
            { key: "expense", label: t.expenses },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key as typeof viewMode)}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                border: "none",
                background: viewMode === tab.key ? "var(--ink)" : "var(--sand)",
                color: viewMode === tab.key ? "var(--paper)" : "var(--ink)",
                fontWeight: 600,
                fontSize: ".85rem",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        <div>
          {filteredTxns.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--ink-soft)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>📊</div>
              <p>{t.noTransactions}</p>
            </div>
          ) : (
            filteredTxns.map((txn) => (
              <div
                key={txn.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  background: "#fff",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: txn.type === "income" ? "#EAF7EE" : "#FBEAEA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}
                  >
                    {txn.type === "income" ? "💰" : "💸"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{txn.category}</div>
                    <div style={{ fontSize: ".78rem", color: "var(--ink-soft)" }}>
                      {txn.description || t.noDescription} · {formatDate(txn.date)}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: txn.type === "income" ? "var(--leaf)" : "#8A2B2B",
                    }}
                  >
                    {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                  </div>
                  <button
                    onClick={() => deleteTransaction(txn.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: ".9rem",
                      opacity: 0.5,
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tips card */}
        <div className="dash-card" style={{ marginTop: 24, background: "var(--sand)" }}>
          <div style={{ fontSize: ".75rem", color: "var(--marigold-deep)", fontWeight: 700, marginBottom: 8 }}>{t.financialTip}</div>
          <p style={{ fontSize: ".9rem", color: "var(--ink)", lineHeight: 1.6 }}>
            {t.tipText}
          </p>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 className="modal-title">
              {txnType === "income" ? `💰 ${t.addIncome}` : `💸 ${t.addExpense}`}
            </h3>

            <div className="form-group">
              <label className="form-label">{t.amount}</label>
              <input
                type="number"
                className="form-input"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.category}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(txnType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "var(--radius-full)",
                      border: category === cat ? "2px solid var(--marigold)" : "1.5px solid var(--line)",
                      background: category === cat ? "rgba(242, 160, 7, 0.1)" : "#fff",
                      color: "var(--ink)",
                      fontWeight: 600,
                      fontSize: ".85rem",
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.description}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t.descPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Bill Image Capture */}
            <div className="form-group">
              <label className="form-label">{t.attachBill}</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    background: "var(--sand)",
                    borderRadius: "var(--radius)",
                    cursor: "pointer",
                    fontSize: ".9rem",
                    fontWeight: 600,
                  }}
                >
                  <span>📷</span>
                  <span>{billImage ? t.changePhoto : t.takePhoto}</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageCapture}
                    style={{ display: "none" }}
                  />
                </label>
                {isProcessingImage && (
                  <span style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>{t.processing}</span>
                )}
              </div>
              {billImage && (
                <div style={{ marginTop: 12, position: "relative" }}>
                  <img
                    src={billImage}
                    alt="Bill preview"
                    style={{
                      width: "100%",
                      maxHeight: 150,
                      objectFit: "cover",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--line)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setBillImage(null)}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      cursor: "pointer",
                      fontSize: ".9rem",
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <button
              className="btn btn-primary full-width"
              onClick={addTransaction}
              disabled={!amount || !category}
              style={{ marginTop: 16 }}
            >
              {txnType === "income" ? t.addIncome : t.addExpense}
            </button>
          </div>
        </div>
      )}

      {/* Voice Input Modal */}
      {showVoiceModal && (
        <div className="modal-overlay" onClick={() => { stopVoiceInput(); setShowVoiceModal(false); }}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 className="modal-title">
              🎤 {t.voiceEntry}
            </h3>

            {/* Voice animation */}
            <div style={{
              textAlign: "center",
              padding: "30px 0",
            }}>
              <div
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: isListening
                    ? "linear-gradient(135deg, #EF4444, #DC2626)"
                    : "linear-gradient(135deg, var(--indigo-light), var(--indigo))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  cursor: "pointer",
                  boxShadow: isListening ? "0 0 0 8px rgba(239, 68, 68, 0.2)" : "0 4px 20px rgba(0,0,0,0.15)",
                  animation: isListening ? "pulse 1.5s infinite" : "none",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>{isListening ? "⏹️" : "🎤"}</span>
              </div>
              <p style={{ fontSize: ".9rem", color: "var(--ink-soft)", marginBottom: 8 }}>
                {isListening ? t.listening : t.tapToSpeak}
              </p>
              <p style={{ fontSize: ".78rem", color: "var(--ink-soft)", fontStyle: "italic" }}>
                {t.voiceExample}
              </p>
            </div>

            {/* Voice transcription */}
            {voiceText && (
              <div style={{
                padding: 16,
                background: "var(--sand)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 16,
              }}>
                <div style={{ fontSize: ".75rem", color: "var(--ink-soft)", marginBottom: 6 }}>
                  {t.youSaid}
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink)" }}>
                  "{voiceText}"
                </div>
              </div>
            )}

            {/* Parsed result */}
            {voiceParsed && (
              <div style={{
                padding: 16,
                background: voiceParsed.type === "income" ? "#EAF7EE" : "#FBEAEA",
                borderRadius: "var(--radius-sm)",
                marginBottom: 16,
              }}>
                <div style={{ fontSize: ".75rem", color: "var(--ink-soft)", marginBottom: 10 }}>
                  {t.detected}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      background: voiceParsed.type === "income" ? "var(--leaf)" : "#DC2626",
                      color: "#fff",
                      fontSize: ".75rem",
                      fontWeight: 700,
                      marginBottom: 6,
                    }}>
                      {voiceParsed.type === "income" ? t.income : t.expense}
                    </div>
                    <div style={{ fontSize: ".85rem", color: "var(--ink-soft)" }}>
                      {voiceParsed.category}
                    </div>
                  </div>
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: voiceParsed.type === "income" ? "var(--leaf)" : "#DC2626",
                  }}>
                    {voiceParsed.type === "income" ? "+" : "-"}₹{voiceParsed.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => { stopVoiceInput(); setShowVoiceModal(false); }}
              >
                {t.cancel}
              </button>
              {voiceParsed && (
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={confirmVoiceTransaction}
                >
                  {t.addEntry}
                </button>
              )}
              {!voiceParsed && !isListening && voiceText && (
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={startVoiceInput}
                >
                  {t.tryAgain}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}
