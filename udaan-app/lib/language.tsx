"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "hi" | "bn" | "ml";

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা",
  ml: "മലയാളം",
};

export const LANG_CODES: Record<Lang, string> = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  ml: "ml-IN",
};

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  langCode: string;
};

const LangContext = createContext<LangContextType | null>(null);
const STORAGE_KEY = "udaan_language";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && ["en", "hi", "bn", "ml"].includes(stored)) {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  if (!mounted) return null;

  return (
    <LangContext.Provider value={{ lang, setLang, langCode: LANG_CODES[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}

// Common UI translations for all languages
export const COMMON_UI: Record<Lang, {
  dashboard: string;
  coach: string;
  finance: string;
  goals: string;
  piggyBank: string;
  community: string;
  signOut: string;
  back: string;
  language: string;
}> = {
  en: {
    dashboard: "Dashboard",
    coach: "My Coach",
    finance: "Finance",
    goals: "Goals",
    piggyBank: "Piggy Bank",
    community: "Community",
    signOut: "Sign out",
    back: "Back",
    language: "Language",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    coach: "मेरी कोच",
    finance: "फाइनेंस",
    goals: "लक्ष्य",
    piggyBank: "गुल्लक",
    community: "समुदाय",
    signOut: "साइन आउट",
    back: "वापस",
    language: "भाषा",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    coach: "আমার কোচ",
    finance: "ফাইনান্স",
    goals: "লক্ষ্য",
    piggyBank: "পিগি ব্যাংক",
    community: "কমিউনিটি",
    signOut: "সাইন আউট",
    back: "ফিরে যান",
    language: "ভাষা",
  },
  ml: {
    dashboard: "ഡാഷ്‌ബോർഡ്",
    coach: "എന്റെ കോച്ച്",
    finance: "ഫൈനാൻസ്",
    goals: "ലക്ഷ്യങ്ങൾ",
    piggyBank: "പിഗ്ഗി ബാങ്ക്",
    community: "കമ്മ്യൂണിറ്റി",
    signOut: "സൈൻ ഔട്ട്",
    back: "തിരികെ",
    language: "ഭാഷ",
  },
};

// Dashboard page translations
export const DASHBOARD_UI: Record<Lang, {
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  namaste: string;
  readyToBuild: string;
  todayPowerMessage: string;
  talkToCoach: string;
  getYourPlan: string;
  trackMoney: string;
  myGoals: string;
  trackProgress: string;
  saveAndGrow: string;
  yourBusinessCoach: string;
  coachDesc: string;
  startConversation: string;
  tipOfTheDay: string;
  notifications: string;
  markAllRead: string;
  noNotifications: string;
  communityHeroes: string;
  heroesDesc: string;
  meetAllHeroes: string;
}> = {
  en: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    namaste: "Namaste",
    readyToBuild: "Ready to build your empire today?",
    todayPowerMessage: "Today's power message from Udaan",
    talkToCoach: "Talk to Coach",
    getYourPlan: "Get your plan",
    trackMoney: "Track money",
    myGoals: "My Goals",
    trackProgress: "Track progress",
    saveAndGrow: "Save & grow",
    yourBusinessCoach: "Your Business Coach",
    coachDesc: "Tell Udaan what you're good at. Get your business plan, pricing, WhatsApp message, and government schemes, all in your language.",
    startConversation: "Start conversation →",
    tipOfTheDay: "💡 Tip of the Day",
    notifications: "Notifications",
    markAllRead: "Mark all read",
    noNotifications: "No notifications yet.",
    communityHeroes: "🏆 Community Heroes",
    heroesDesc: "Women who used Udaan to launch real businesses. Get inspired, or reach out to them directly.",
    meetAllHeroes: "Meet all heroes →",
  },
  hi: {
    goodMorning: "सुप्रभात",
    goodAfternoon: "नमस्कार",
    goodEvening: "शुभ संध्या",
    namaste: "नमस्ते",
    readyToBuild: "आज अपना साम्राज्य बनाने के लिए तैयार?",
    todayPowerMessage: "उड़ान से आज का पॉवर मैसेज",
    talkToCoach: "कोच से बात करें",
    getYourPlan: "अपनी योजना पाएं",
    trackMoney: "पैसे ट्रैक करें",
    myGoals: "मेरे लक्ष्य",
    trackProgress: "प्रगति देखें",
    saveAndGrow: "बचाएं और बढ़ाएं",
    yourBusinessCoach: "आपका बिज़नेस कोच",
    coachDesc: "उड़ान को बताइए आप क्या अच्छा करती हैं। पाइए बिज़नेस प्लान, दाम, WhatsApp संदेश, और सरकारी योजनाएं, अपनी भाषा में।",
    startConversation: "बातचीत शुरू करें →",
    tipOfTheDay: "💡 आज की टिप",
    notifications: "सूचनाएं",
    markAllRead: "सभी पढ़ा हुआ करें",
    noNotifications: "अभी कोई सूचना नहीं।",
    communityHeroes: "🏆 समुदाय की हीरो",
    heroesDesc: "वो महिलाएं जिन्होंने उड़ान से असली बिज़नेस शुरू किया। प्रेरणा लें या उनसे सीधे जुड़ें।",
    meetAllHeroes: "सभी हीरो से मिलें →",
  },
  bn: {
    goodMorning: "সুপ্রভাত",
    goodAfternoon: "শুভ অপরাহ্ন",
    goodEvening: "শুভ সন্ধ্যা",
    namaste: "নমস্কার",
    readyToBuild: "আজ আপনার সাম্রাজ্য গড়তে প্রস্তুত?",
    todayPowerMessage: "উড়ান থেকে আজকের পাওয়ার মেসেজ",
    talkToCoach: "কোচের সাথে কথা বলুন",
    getYourPlan: "আপনার প্ল্যান পান",
    trackMoney: "টাকা ট্র্যাক করুন",
    myGoals: "আমার লক্ষ্য",
    trackProgress: "অগ্রগতি দেখুন",
    saveAndGrow: "সঞ্চয় করুন",
    yourBusinessCoach: "আপনার বিজনেস কোচ",
    coachDesc: "উড়ানকে বলুন আপনি কী ভালো করেন। পান বিজনেস প্ল্যান, দাম, WhatsApp মেসেজ, এবং সরকারি স্কিম, আপনার ভাষায়।",
    startConversation: "কথোপকথন শুরু করুন →",
    tipOfTheDay: "💡 আজকের টিপ",
    notifications: "নোটিফিকেশন",
    markAllRead: "সব পড়া হিসেবে চিহ্নিত করুন",
    noNotifications: "এখনো কোনো নোটিফিকেশন নেই।",
    communityHeroes: "🏆 কমিউনিটি হিরো",
    heroesDesc: "যে মহিলারা উড়ান দিয়ে আসল বিজনেস শুরু করেছেন। অনুপ্রাণিত হন বা সরাসরি যোগাযোগ করুন।",
    meetAllHeroes: "সব হিরোদের সাথে দেখা করুন →",
  },
  ml: {
    goodMorning: "സുപ്രഭാതം",
    goodAfternoon: "ശുഭ ഉച്ച",
    goodEvening: "ശുഭ സന്ധ്യ",
    namaste: "നമസ്കാരം",
    readyToBuild: "ഇന്ന് നിങ്ങളുടെ സാമ്രാജ്യം കെട്ടിപ്പടുക്കാൻ തയ്യാറാണോ?",
    todayPowerMessage: "ഉഡാനിൽ നിന്നുള്ള ഇന്നത്തെ പവർ മെസേജ്",
    talkToCoach: "കോച്ചിനോട് സംസാരിക്കുക",
    getYourPlan: "നിങ്ങളുടെ പ്ലാൻ നേടുക",
    trackMoney: "പണം ട്രാക്ക് ചെയ്യുക",
    myGoals: "എന്റെ ലക്ഷ്യങ്ങൾ",
    trackProgress: "പുരോഗതി കാണുക",
    saveAndGrow: "സേവ് & വളരുക",
    yourBusinessCoach: "നിങ്ങളുടെ ബിസിനസ് കോച്ച്",
    coachDesc: "നിങ്ങൾക്ക് എന്താണ് നന്നായി ചെയ്യാൻ കഴിയുന്നതെന്ന് ഉഡാനോട് പറയൂ. ബിസിനസ് പ്ലാൻ, വില, WhatsApp മെസേജ്, സർക്കാർ സ്കീമുകൾ നിങ്ങളുടെ ഭാഷയിൽ നേടൂ.",
    startConversation: "സംഭാഷണം ആരംഭിക്കുക →",
    tipOfTheDay: "💡 ഇന്നത്തെ ടിപ്പ്",
    notifications: "നോട്ടിഫിക്കേഷനുകൾ",
    markAllRead: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക",
    noNotifications: "ഇതുവരെ നോട്ടിഫിക്കേഷനുകളില്ല.",
    communityHeroes: "🏆 കമ്മ്യൂണിറ്റി ഹീറോസ്",
    heroesDesc: "ഉഡാൻ ഉപയോഗിച്ച് യഥാർത്ഥ ബിസിനസുകൾ ആരംഭിച്ച സ്ത്രീകൾ. പ്രചോദനം നേടുക അല്ലെങ്കിൽ നേരിട്ട് ബന്ധപ്പെടുക.",
    meetAllHeroes: "എല്ലാ ഹീറോകളെയും കാണുക →",
  },
};

// Finance page translations
export const FINANCE_UI: Record<Lang, {
  eyebrow: string;
  title: string;
  subtitle: string;
  totalIncome: string;
  totalExpense: string;
  netProfit: string;
  thisMonth: string;
  income: string;
  expense: string;
  net: string;
  addIncome: string;
  addExpense: string;
  speakToAdd: string;
  all: string;
  expenses: string;
  noTransactions: string;
  startAdding: string;
  financialTip: string;
  tipText: string;
  amount: string;
  category: string;
  description: string;
  descPlaceholder: string;
  attachBill: string;
  takePhoto: string;
  changePhoto: string;
  processing: string;
  voiceEntry: string;
  listening: string;
  tapToSpeak: string;
  youSaid: string;
  detected: string;
  cancel: string;
  addEntry: string;
  tryAgain: string;
  voiceExample: string;
  noDescription: string;
}> = {
  en: {
    eyebrow: "FINANCIAL MANAGEMENT",
    title: "Track Your Money",
    subtitle: "Keep track of every rupee: what comes in and what goes out.",
    totalIncome: "TOTAL INCOME",
    totalExpense: "TOTAL EXPENSE",
    netProfit: "NET PROFIT",
    thisMonth: "THIS MONTH",
    income: "Income",
    expense: "Expense",
    net: "Net",
    addIncome: "+ Add Income",
    addExpense: "+ Add Expense",
    speakToAdd: "Speak to Add Entry",
    all: "All",
    expenses: "Expenses",
    noTransactions: "No transactions yet. Start by adding your first income or expense!",
    startAdding: "Start adding",
    financialTip: "💡 FINANCIAL TIP",
    tipText: "Write down every income and expense daily. Small leaks sink big ships. Tracking helps you see where your money goes and find ways to save more!",
    amount: "Amount (₹)",
    category: "Category",
    description: "Description (optional)",
    descPlaceholder: "e.g., Sold 5 samosas",
    attachBill: "Attach Bill/Receipt (optional)",
    takePhoto: "Take Photo",
    changePhoto: "Change Photo",
    processing: "Processing...",
    voiceEntry: "Voice Entry",
    listening: "Listening... speak now",
    tapToSpeak: "Tap the mic and speak",
    youSaid: "You said:",
    detected: "Detected:",
    cancel: "Cancel",
    addEntry: "Add Entry",
    tryAgain: "Try Again",
    voiceExample: 'Example: "I sold samosas for 500 rupees" or "Spent 100 on transport"',
    noDescription: "No description",
  },
  hi: {
    eyebrow: "वित्तीय प्रबंधन",
    title: "अपना पैसा ट्रैक करें",
    subtitle: "हर रुपये का हिसाब रखें: क्या आया और क्या गया।",
    totalIncome: "कुल आमदनी",
    totalExpense: "कुल खर्च",
    netProfit: "शुद्ध लाभ",
    thisMonth: "इस महीने",
    income: "आमदनी",
    expense: "खर्च",
    net: "शुद्ध",
    addIncome: "+ आमदनी जोड़ें",
    addExpense: "+ खर्च जोड़ें",
    speakToAdd: "बोलकर एंट्री करें",
    all: "सभी",
    expenses: "खर्चे",
    noTransactions: "अभी कोई लेनदेन नहीं। अपनी पहली आमदनी या खर्च जोड़कर शुरू करें!",
    startAdding: "जोड़ना शुरू करें",
    financialTip: "💡 वित्तीय सुझाव",
    tipText: "हर दिन हर आमदनी और खर्च लिखें। छोटे-छोटे लीक बड़े जहाज डुबो देते हैं। ट्रैकिंग से पता चलता है पैसा कहां जाता है और कैसे बचाएं!",
    amount: "राशि (₹)",
    category: "श्रेणी",
    description: "विवरण (वैकल्पिक)",
    descPlaceholder: "जैसे, 5 समोसे बेचे",
    attachBill: "बिल/रसीद लगाएं (वैकल्पिक)",
    takePhoto: "फोटो लें",
    changePhoto: "फोटो बदलें",
    processing: "प्रोसेसिंग...",
    voiceEntry: "बोलकर एंट्री",
    listening: "सुन रहा हूं... बोलिए",
    tapToSpeak: "माइक पर टैप करें और बोलें",
    youSaid: "आपने कहा:",
    detected: "पहचाना गया:",
    cancel: "रद्द करें",
    addEntry: "जोड़ें",
    tryAgain: "फिर से बोलें",
    voiceExample: 'जैसे: "आज मैंने 500 रुपये की बिक्री की" या "100 रुपये ट्रांसपोर्ट में खर्च किए"',
    noDescription: "कोई विवरण नहीं",
  },
  bn: {
    eyebrow: "আর্থিক ব্যবস্থাপনা",
    title: "আপনার টাকা ট্র্যাক করুন",
    subtitle: "প্রতিটি টাকার হিসাব রাখুন: কী এলো আর কী গেল।",
    totalIncome: "মোট আয়",
    totalExpense: "মোট খরচ",
    netProfit: "নিট লাভ",
    thisMonth: "এই মাসে",
    income: "আয়",
    expense: "খরচ",
    net: "নিট",
    addIncome: "+ আয় যোগ করুন",
    addExpense: "+ খরচ যোগ করুন",
    speakToAdd: "কথা বলে এন্ট্রি করুন",
    all: "সব",
    expenses: "খরচ",
    noTransactions: "এখনো কোনো লেনদেন নেই। প্রথম আয় বা খরচ যোগ করে শুরু করুন!",
    startAdding: "যোগ করা শুরু করুন",
    financialTip: "💡 আর্থিক টিপ",
    tipText: "প্রতিদিন প্রতিটি আয় এবং খরচ লিখুন। ছোট ছোট ছিদ্র বড় জাহাজ ডুবিয়ে দেয়। ট্র্যাকিং দেখায় টাকা কোথায় যায় এবং কীভাবে বাঁচাবেন!",
    amount: "পরিমাণ (₹)",
    category: "ক্যাটাগরি",
    description: "বিবরণ (ঐচ্ছিক)",
    descPlaceholder: "যেমন, ৫টি সিঙ্গারা বিক্রি করলাম",
    attachBill: "বিল/রসিদ সংযুক্ত করুন (ঐচ্ছিক)",
    takePhoto: "ফটো তুলুন",
    changePhoto: "ফটো বদলান",
    processing: "প্রসেসিং...",
    voiceEntry: "ভয়েস এন্ট্রি",
    listening: "শুনছি... বলুন",
    tapToSpeak: "মাইকে ট্যাপ করে বলুন",
    youSaid: "আপনি বললেন:",
    detected: "সনাক্ত হয়েছে:",
    cancel: "বাতিল",
    addEntry: "এন্ট্রি যোগ করুন",
    tryAgain: "আবার চেষ্টা করুন",
    voiceExample: 'উদাহরণ: "আমি ৫০০ টাকার সিঙ্গারা বিক্রি করেছি" বা "১০০ টাকা যাতায়াতে খরচ"',
    noDescription: "কোনো বিবরণ নেই",
  },
  ml: {
    eyebrow: "സാമ്പത്തിക മാനേജ്മെന്റ്",
    title: "നിങ്ങളുടെ പണം ട്രാക്ക് ചെയ്യുക",
    subtitle: "ഓരോ രൂപയുടെയും കണക്ക് സൂക്ഷിക്കുക: എന്ത് വന്നു എന്ത് പോയി.",
    totalIncome: "മൊത്തം വരുമാനം",
    totalExpense: "മൊത്തം ചെലവ്",
    netProfit: "നെറ്റ് ലാഭം",
    thisMonth: "ഈ മാസം",
    income: "വരുമാനം",
    expense: "ചെലവ്",
    net: "നെറ്റ്",
    addIncome: "+ വരുമാനം ചേർക്കുക",
    addExpense: "+ ചെലവ് ചേർക്കുക",
    speakToAdd: "സംസാരിച്ച് എൻട്രി ചെയ്യുക",
    all: "എല്ലാം",
    expenses: "ചെലവുകൾ",
    noTransactions: "ഇതുവരെ ഇടപാടുകളില്ല. ആദ്യത്തെ വരുമാനം അല്ലെങ്കിൽ ചെലവ് ചേർത്ത് തുടങ്ങുക!",
    startAdding: "ചേർക്കാൻ തുടങ്ങുക",
    financialTip: "💡 സാമ്പത്തിക ടിപ്പ്",
    tipText: "എല്ലാ ദിവസവും എല്ലാ വരുമാനവും ചെലവും എഴുതുക. ചെറിയ ചോർച്ചകൾ വലിയ കപ്പലുകളെ മുക്കും. ട്രാക്കിംഗ് പണം എവിടെ പോകുന്നുവെന്നും എങ്ങനെ ലാഭിക്കാമെന്നും കാണിക്കുന്നു!",
    amount: "തുക (₹)",
    category: "വിഭാഗം",
    description: "വിവരണം (ഓപ്ഷണൽ)",
    descPlaceholder: "ഉദാ: 5 സമൂസ വിറ്റു",
    attachBill: "ബിൽ/രസീത് അറ്റാച്ച് ചെയ്യുക (ഓപ്ഷണൽ)",
    takePhoto: "ഫോട്ടോ എടുക്കുക",
    changePhoto: "ഫോട്ടോ മാറ്റുക",
    processing: "പ്രോസസ്സിംഗ്...",
    voiceEntry: "വോയ്സ് എൻട്രി",
    listening: "കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക",
    tapToSpeak: "മൈക്കിൽ ടാപ്പ് ചെയ്ത് സംസാരിക്കുക",
    youSaid: "നിങ്ങൾ പറഞ്ഞു:",
    detected: "കണ്ടെത്തി:",
    cancel: "റദ്ദാക്കുക",
    addEntry: "എൻട്രി ചേർക്കുക",
    tryAgain: "വീണ്ടും ശ്രമിക്കുക",
    voiceExample: 'ഉദാ: "ഞാൻ 500 രൂപയ്ക്ക് സമൂസ വിറ്റു" അല്ലെങ്കിൽ "100 രൂപ യാത്രയ്ക്ക് ചെലവാക്കി"',
    noDescription: "വിവരണമില്ല",
  },
};

// Goals page translations
export const GOALS_UI: Record<Lang, {
  eyebrow: string;
  title: string;
  subtitle: string;
  activeGoals: string;
  achieved: string;
  totalSaved: string;
  active: string;
  done: string;
  complete: string;
  toGo: string;
  almostThere: string;
  target: string;
  addSavings: string;
  delete: string;
  addNewGoal: string;
  setNewGoal: string;
  pickEmoji: string;
  goalName: string;
  goalNamePlaceholder: string;
  targetAmount: string;
  targetAmountPlaceholder: string;
  targetDate: string;
  createGoal: string;
  addToSavings: string;
  amountSaved: string;
  amountPlaceholder: string;
}> = {
  en: {
    eyebrow: "Goals Tracker",
    title: "Your dreams, made real 🎯",
    subtitle: "Set a goal, add your earnings, watch your dream get closer every day.",
    activeGoals: "Active goals",
    achieved: "Achieved 🏆",
    totalSaved: "Total saved",
    active: "Active",
    done: "Done 🏆",
    complete: "complete",
    toGo: "to go",
    almostThere: "🔥 Almost there!",
    target: "Target",
    addSavings: "+ Add savings",
    delete: "Delete",
    addNewGoal: "Add a new goal",
    setNewGoal: "Set a new goal 🎯",
    pickEmoji: "Pick an emoji",
    goalName: "Goal name",
    goalNamePlaceholder: "e.g. Buy sewing machine for business",
    targetAmount: "Target amount (₹)",
    targetAmountPlaceholder: "e.g. 50000",
    targetDate: "Target date (optional)",
    createGoal: "Create goal",
    addToSavings: "Add to your savings 💰",
    amountSaved: "Amount saved (₹)",
    amountPlaceholder: "e.g. 500",
  },
  hi: {
    eyebrow: "लक्ष्य ट्रैकर",
    title: "आपके सपने, सच होते हुए 🎯",
    subtitle: "लक्ष्य बनाएं, कमाई जोड़ें, हर दिन सपने को करीब आते देखें।",
    activeGoals: "सक्रिय लक्ष्य",
    achieved: "हासिल 🏆",
    totalSaved: "कुल बचत",
    active: "सक्रिय",
    done: "पूरा 🏆",
    complete: "पूरा",
    toGo: "बाकी",
    almostThere: "🔥 लगभग पहुंच गए!",
    target: "लक्ष्य",
    addSavings: "+ बचत जोड़ें",
    delete: "हटाएं",
    addNewGoal: "नया लक्ष्य जोड़ें",
    setNewGoal: "नया लक्ष्य बनाएं 🎯",
    pickEmoji: "इमोजी चुनें",
    goalName: "लक्ष्य का नाम",
    goalNamePlaceholder: "जैसे: बिज़नेस के लिए सिलाई मशीन खरीदना",
    targetAmount: "लक्ष्य राशि (₹)",
    targetAmountPlaceholder: "जैसे: 50000",
    targetDate: "लक्ष्य तारीख (वैकल्पिक)",
    createGoal: "लक्ष्य बनाएं",
    addToSavings: "बचत में जोड़ें 💰",
    amountSaved: "बचाई गई राशि (₹)",
    amountPlaceholder: "जैसे: 500",
  },
  bn: {
    eyebrow: "গোল ট্র্যাকার",
    title: "আপনার স্বপ্ন, বাস্তব হচ্ছে 🎯",
    subtitle: "লক্ষ্য ঠিক করুন, আয় যোগ করুন, প্রতিদিন স্বপ্নকে কাছে আসতে দেখুন।",
    activeGoals: "সক্রিয় লক্ষ্য",
    achieved: "অর্জিত 🏆",
    totalSaved: "মোট সঞ্চয়",
    active: "সক্রিয়",
    done: "সম্পন্ন 🏆",
    complete: "সম্পূর্ণ",
    toGo: "বাকি",
    almostThere: "🔥 প্রায় পৌঁছে গেছেন!",
    target: "লক্ষ্য",
    addSavings: "+ সঞ্চয় যোগ করুন",
    delete: "মুছুন",
    addNewGoal: "নতুন লক্ষ্য যোগ করুন",
    setNewGoal: "নতুন লক্ষ্য ঠিক করুন 🎯",
    pickEmoji: "একটি ইমোজি বাছুন",
    goalName: "লক্ষ্যের নাম",
    goalNamePlaceholder: "যেমন: ব্যবসার জন্য সেলাই মেশিন কেনা",
    targetAmount: "লক্ষ্য পরিমাণ (₹)",
    targetAmountPlaceholder: "যেমন: 50000",
    targetDate: "লক্ষ্য তারিখ (ঐচ্ছিক)",
    createGoal: "লক্ষ্য তৈরি করুন",
    addToSavings: "সঞ্চয়ে যোগ করুন 💰",
    amountSaved: "সঞ্চিত পরিমাণ (₹)",
    amountPlaceholder: "যেমন: 500",
  },
  ml: {
    eyebrow: "ഗോൾ ട്രാക്കർ",
    title: "നിങ്ങളുടെ സ്വപ്നങ്ങൾ, യാഥാർത്ഥ്യമാകുന്നു 🎯",
    subtitle: "ഒരു ലക്ഷ്യം സജ്ജമാക്കുക, വരുമാനം ചേർക്കുക, എല്ലാ ദിവസവും സ്വപ്നം അടുത്ത് വരുന്നത് കാണുക.",
    activeGoals: "സജീവ ലക്ഷ്യങ്ങൾ",
    achieved: "നേടിയത് 🏆",
    totalSaved: "മൊത്തം സേവിംഗ്സ്",
    active: "സജീവം",
    done: "പൂർത്തിയായി 🏆",
    complete: "പൂർത്തി",
    toGo: "ബാക്കി",
    almostThere: "🔥 ഏതാണ്ട് എത്തി!",
    target: "ലക്ഷ്യം",
    addSavings: "+ സേവിംഗ്സ് ചേർക്കുക",
    delete: "ഇല്ലാതാക്കുക",
    addNewGoal: "പുതിയ ലക്ഷ്യം ചേർക്കുക",
    setNewGoal: "പുതിയ ലക്ഷ്യം സജ്ജമാക്കുക 🎯",
    pickEmoji: "ഒരു ഇമോജി തിരഞ്ഞെടുക്കുക",
    goalName: "ലക്ഷ്യത്തിന്റെ പേര്",
    goalNamePlaceholder: "ഉദാ: ബിസിനസിനായി തയ്യൽ മെഷീൻ വാങ്ങുക",
    targetAmount: "ലക്ഷ്യ തുക (₹)",
    targetAmountPlaceholder: "ഉദാ: 50000",
    targetDate: "ലക്ഷ്യ തീയതി (ഓപ്ഷണൽ)",
    createGoal: "ലക്ഷ്യം സൃഷ്ടിക്കുക",
    addToSavings: "സേവിംഗ്സിലേക്ക് ചേർക്കുക 💰",
    amountSaved: "സേവ് ചെയ്ത തുക (₹)",
    amountPlaceholder: "ഉദാ: 500",
  },
};

// Piggy Bank page translations
export const PIGGYBANK_UI: Record<Lang, {
  eyebrow: string;
  title: string;
  subtitle: string;
  totalSavedAcross: string;
  savings: string;
  of: string;
  toGo: string;
  goalReached: string;
  saveMoney: string;
  history: string;
  hideHistory: string;
  noSavingsYet: string;
  createNewJar: string;
  createSavingsJar: string;
  pickEmoji: string;
  jarName: string;
  jarNamePlaceholder: string;
  targetAmountOptional: string;
  createJar: string;
  addTo: string;
  amountLabel: string;
  noteOptional: string;
  notePlaceholder: string;
  saveMoney2: string;
  smartSavingTips: string;
  tips: string[];
}> = {
  en: {
    eyebrow: "Piggy Bank",
    title: "Your savings, growing 🐷",
    subtitle: "Separate jars for separate dreams. Watch your money grow.",
    totalSavedAcross: "Total saved across all jars",
    savings: "savings",
    of: "of",
    toGo: "to go",
    goalReached: "🎉 Goal reached!",
    saveMoney: "+ Save money",
    history: "History ↓",
    hideHistory: "Hide history ↑",
    noSavingsYet: "No savings yet. Add your first! 🌱",
    createNewJar: "Create a new savings jar",
    createSavingsJar: "Create a savings jar 🏺",
    pickEmoji: "Pick an emoji",
    jarName: "Jar name",
    jarNamePlaceholder: "e.g. Family medical fund",
    targetAmountOptional: "Target amount ₹ (optional)",
    createJar: "Create jar",
    addTo: "Add to",
    amountLabel: "Amount (₹)",
    noteOptional: "Note (optional)",
    notePlaceholder: "e.g. Tiffin earnings",
    saveMoney2: "Save money",
    smartSavingTips: "💡 Smart Saving Tips",
    tips: [
      "Open a Jan Dhan zero-balance account this week. It's free, and your money is safe.",
      "Save first, spend later. Even ₹10/day = ₹3,650/year.",
      "Join a local SHG (Self-Help Group) for group savings and easy credit.",
      "Keep a separate savings jar for unexpected expenses (medical, repairs).",
    ],
  },
  hi: {
    eyebrow: "गुल्लक",
    title: "आपकी बचत, बढ़ रही है 🐷",
    subtitle: "अलग-अलग सपनों के लिए अलग-अलग बर्तन। अपने पैसे को बढ़ते देखें।",
    totalSavedAcross: "सभी बर्तनों में कुल बचत",
    savings: "बचत",
    of: "का",
    toGo: "बाकी",
    goalReached: "🎉 लक्ष्य पूरा!",
    saveMoney: "+ पैसे बचाएं",
    history: "इतिहास ↓",
    hideHistory: "इतिहास छुपाएं ↑",
    noSavingsYet: "अभी कोई बचत नहीं। पहली जोड़ें! 🌱",
    createNewJar: "नया बचत बर्तन बनाएं",
    createSavingsJar: "बचत बर्तन बनाएं 🏺",
    pickEmoji: "इमोजी चुनें",
    jarName: "बर्तन का नाम",
    jarNamePlaceholder: "जैसे: परिवार मेडिकल फंड",
    targetAmountOptional: "लक्ष्य राशि ₹ (वैकल्पिक)",
    createJar: "बर्तन बनाएं",
    addTo: "में जोड़ें",
    amountLabel: "राशि (₹)",
    noteOptional: "नोट (वैकल्पिक)",
    notePlaceholder: "जैसे: टिफिन की कमाई",
    saveMoney2: "पैसे बचाएं",
    smartSavingTips: "💡 स्मार्ट बचत सुझाव",
    tips: [
      "इस हफ्ते जन धन जीरो-बैलेंस खाता खोलें। यह मुफ्त है, और आपका पैसा सुरक्षित है।",
      "पहले बचाएं, बाद में खर्च करें। ₹10/दिन भी = ₹3,650/साल।",
      "स्थानीय SHG (सेल्फ-हेल्प ग्रुप) से जुड़ें - सामूहिक बचत और आसान क्रेडिट के लिए।",
      "अप्रत्याशित खर्चों के लिए अलग बचत बर्तन रखें (मेडिकल, मरम्मत)।",
    ],
  },
  bn: {
    eyebrow: "পিগি ব্যাংক",
    title: "আপনার সঞ্চয়, বাড়ছে 🐷",
    subtitle: "আলাদা স্বপ্নের জন্য আলাদা জার। আপনার টাকা বাড়তে দেখুন।",
    totalSavedAcross: "সব জারে মোট সঞ্চয়",
    savings: "সঞ্চয়",
    of: "এর",
    toGo: "বাকি",
    goalReached: "🎉 লক্ষ্য পূরণ!",
    saveMoney: "+ টাকা সঞ্চয় করুন",
    history: "ইতিহাস ↓",
    hideHistory: "ইতিহাস লুকান ↑",
    noSavingsYet: "এখনো কোনো সঞ্চয় নেই। প্রথমটি যোগ করুন! 🌱",
    createNewJar: "নতুন সঞ্চয় জার তৈরি করুন",
    createSavingsJar: "সঞ্চয় জার তৈরি করুন 🏺",
    pickEmoji: "ইমোজি বেছে নিন",
    jarName: "জারের নাম",
    jarNamePlaceholder: "যেমন: পরিবার মেডিকেল ফান্ড",
    targetAmountOptional: "লক্ষ্য পরিমাণ ₹ (ঐচ্ছিক)",
    createJar: "জার তৈরি করুন",
    addTo: "তে যোগ করুন",
    amountLabel: "পরিমাণ (₹)",
    noteOptional: "নোট (ঐচ্ছিক)",
    notePlaceholder: "যেমন: টিফিনের আয়",
    saveMoney2: "টাকা সঞ্চয় করুন",
    smartSavingTips: "💡 স্মার্ট সঞ্চয় টিপস",
    tips: [
      "এই সপ্তাহে জন ধন জিরো-ব্যালেন্স অ্যাকাউন্ট খুলুন। এটি বিনামূল্যে, এবং আপনার টাকা নিরাপদ।",
      "আগে সঞ্চয় করুন, পরে খরচ করুন। ₹10/দিনও = ₹3,650/বছর।",
      "স্থানীয় SHG (সেল্ফ-হেল্প গ্রুপ) এ যোগ দিন - গ্রুপ সঞ্চয় এবং সহজ ক্রেডিটের জন্য।",
      "অপ্রত্যাশিত খরচের জন্য আলাদা সঞ্চয় জার রাখুন (চিকিৎসা, মেরামত)।",
    ],
  },
  ml: {
    eyebrow: "പിഗ്ഗി ബാങ്ക്",
    title: "നിങ്ങളുടെ സേവിംഗ്സ്, വളരുന്നു 🐷",
    subtitle: "വ്യത്യസ്ത സ്വപ്നങ്ങൾക്ക് വ്യത്യസ്ത ജാറുകൾ. നിങ്ങളുടെ പണം വളരുന്നത് കാണുക.",
    totalSavedAcross: "എല്ലാ ജാറുകളിലും മൊത്തം സേവിംഗ്സ്",
    savings: "സേവിംഗ്സ്",
    of: "ന്റെ",
    toGo: "ബാക്കി",
    goalReached: "🎉 ലക്ഷ്യം നേടി!",
    saveMoney: "+ പണം സേവ് ചെയ്യുക",
    history: "ഹിസ്റ്ററി ↓",
    hideHistory: "ഹിസ്റ്ററി മറയ്ക്കുക ↑",
    noSavingsYet: "ഇതുവരെ സേവിംഗ്സ് ഇല്ല. ആദ്യത്തേത് ചേർക്കുക! 🌱",
    createNewJar: "പുതിയ സേവിംഗ്സ് ജാർ സൃഷ്ടിക്കുക",
    createSavingsJar: "സേവിംഗ്സ് ജാർ സൃഷ്ടിക്കുക 🏺",
    pickEmoji: "ഇമോജി തിരഞ്ഞെടുക്കുക",
    jarName: "ജാറിന്റെ പേര്",
    jarNamePlaceholder: "ഉദാ: കുടുംബ മെഡിക്കൽ ഫണ്ട്",
    targetAmountOptional: "ലക്ഷ്യ തുക ₹ (ഓപ്ഷണൽ)",
    createJar: "ജാർ സൃഷ്ടിക്കുക",
    addTo: "ലേക്ക് ചേർക്കുക",
    amountLabel: "തുക (₹)",
    noteOptional: "കുറിപ്പ് (ഓപ്ഷണൽ)",
    notePlaceholder: "ഉദാ: ടിഫിൻ വരുമാനം",
    saveMoney2: "പണം സേവ് ചെയ്യുക",
    smartSavingTips: "💡 സ്മാർട്ട് സേവിംഗ് ടിപ്പുകൾ",
    tips: [
      "ഈ ആഴ്ച ജൻ ധൻ സീറോ-ബാലൻസ് അക്കൗണ്ട് തുറക്കുക. ഇത് സൗജന്യമാണ്, നിങ്ങളുടെ പണം സുരക്ഷിതമാണ്.",
      "ആദ്യം സേവ് ചെയ്യുക, പിന്നീട് ചെലവാക്കുക. ₹10/ദിവസവും = ₹3,650/വർഷം.",
      "ഗ്രൂപ്പ് സേവിംഗ്‌സിനും എളുപ്പത്തിലുള്ള ക്രെഡിറ്റിനും ലോക്കൽ SHG-യിൽ ചേരുക.",
      "അപ്രതീക്ഷിത ചെലവുകൾക്കായി പ്രത്യേക സേവിംഗ്സ് ജാർ സൂക്ഷിക്കുക (മെഡിക്കൽ, റിപ്പയർ).",
    ],
  },
};

// Community page translations
export const COMMUNITY_UI: Record<Lang, {
  eyebrow: string;
  title: string;
  subtitle: string;
  womenHelped: string;
  cities: string;
  avgMonthlyIncome: string;
  firstOrderTime: string;
  fiveDays: string;
  firstOrderIn: string;
  month: string;
  readHerStory: string;
  showLess: string;
  whatsappHer: string;
  instagram: string;
  yourStoryNext: string;
  yourStoryDesc: string;
  talkToCoach: string;
}> = {
  en: {
    eyebrow: "Community Heroes",
    title: "Women who flew first 🏆",
    subtitle: "Real women who used Udaan to launch their businesses. Get inspired, or reach out directly. They've been where you are.",
    womenHelped: "Women helped",
    cities: "Cities",
    avgMonthlyIncome: "Avg monthly income",
    firstOrderTime: "First order time",
    fiveDays: "~5 days",
    firstOrderIn: "First order in",
    month: "month",
    readHerStory: "Read her story ↓",
    showLess: "Show less ↑",
    whatsappHer: "WhatsApp her",
    instagram: "Instagram",
    yourStoryNext: "Your story could be next",
    yourStoryDesc: "Every hero above started exactly where you are. Talk to your coach today.",
    talkToCoach: "Talk to my coach →",
  },
  hi: {
    eyebrow: "समुदाय की हीरो",
    title: "वो महिलाएं जो पहले उड़ीं 🏆",
    subtitle: "असली महिलाएं जिन्होंने उड़ान से अपना बिज़नेस शुरू किया। प्रेरणा लें, या सीधे जुड़ें। वे वहीं थीं जहां आप हैं।",
    womenHelped: "महिलाओं की मदद",
    cities: "शहर",
    avgMonthlyIncome: "औसत मासिक आय",
    firstOrderTime: "पहले ऑर्डर का समय",
    fiveDays: "~5 दिन",
    firstOrderIn: "पहला ऑर्डर",
    month: "महीना",
    readHerStory: "उनकी कहानी पढ़ें ↓",
    showLess: "कम दिखाएं ↑",
    whatsappHer: "WhatsApp करें",
    instagram: "Instagram",
    yourStoryNext: "आपकी कहानी अगली हो सकती है",
    yourStoryDesc: "ऊपर की हर हीरो ने वहीं से शुरू किया जहां आप हैं। आज अपने कोच से बात करें।",
    talkToCoach: "मेरे कोच से बात करें →",
  },
  bn: {
    eyebrow: "কমিউনিটি হিরো",
    title: "যারা প্রথম উড়ে গেছেন 🏆",
    subtitle: "আসল মহিলারা যারা উড়ান ব্যবহার করে তাদের ব্যবসা শুরু করেছেন। অনুপ্রাণিত হন, বা সরাসরি যোগাযোগ করুন। তারা ঠিক সেখানেই ছিলেন যেখানে আপনি আছেন।",
    womenHelped: "মহিলাদের সাহায্য করা হয়েছে",
    cities: "শহর",
    avgMonthlyIncome: "গড় মাসিক আয়",
    firstOrderTime: "প্রথম অর্ডারের সময়",
    fiveDays: "~5 দিন",
    firstOrderIn: "প্রথম অর্ডার",
    month: "মাস",
    readHerStory: "তার গল্প পড়ুন ↓",
    showLess: "কম দেখান ↑",
    whatsappHer: "WhatsApp করুন",
    instagram: "Instagram",
    yourStoryNext: "আপনার গল্প পরের হতে পারে",
    yourStoryDesc: "উপরের প্রতিটি হিরো ঠিক সেখান থেকে শুরু করেছিলেন যেখানে আপনি আছেন। আজই আপনার কোচের সাথে কথা বলুন।",
    talkToCoach: "আমার কোচের সাথে কথা বলুন →",
  },
  ml: {
    eyebrow: "കമ്മ്യൂണിറ്റി ഹീറോസ്",
    title: "ആദ്യം പറന്ന സ്ത്രീകൾ 🏆",
    subtitle: "ഉഡാൻ ഉപയോഗിച്ച് ബിസിനസ് ആരംഭിച്ച യഥാർത്ഥ സ്ത്രീകൾ. പ്രചോദനം നേടുക, അല്ലെങ്കിൽ നേരിട്ട് ബന്ധപ്പെടുക. അവർ നിങ്ങളുള്ള അതേ സ്ഥലത്തായിരുന്നു.",
    womenHelped: "സഹായിച്ച സ്ത്രീകൾ",
    cities: "നഗരങ്ങൾ",
    avgMonthlyIncome: "ശരാശരി മാസ വരുമാനം",
    firstOrderTime: "ആദ്യ ഓർഡർ സമയം",
    fiveDays: "~5 ദിവസം",
    firstOrderIn: "ആദ്യ ഓർഡർ",
    month: "മാസം",
    readHerStory: "അവളുടെ കഥ വായിക്കുക ↓",
    showLess: "കുറച്ച് കാണിക്കുക ↑",
    whatsappHer: "WhatsApp ചെയ്യുക",
    instagram: "Instagram",
    yourStoryNext: "നിങ്ങളുടെ കഥ അടുത്തതാകാം",
    yourStoryDesc: "മുകളിലുള്ള എല്ലാ ഹീറോകളും നിങ്ങളുള്ള അതേ സ്ഥലത്ത് നിന്നാണ് തുടങ്ങിയത്. ഇന്ന് നിങ്ങളുടെ കോച്ചിനോട് സംസാരിക്കുക.",
    talkToCoach: "എന്റെ കോച്ചിനോട് സംസാരിക്കുക →",
  },
};

// Auth page translations
export const AUTH_UI: Record<Lang, {
  welcomeToUdaan: string;
  verifyNumber: string;
  almostThere: string;
  tagline: string;
  sentOtp: string;
  whatToCall: string;
  enterMobile: string;
  willReceiveOtp: string;
  sendOtp: string;
  sending: string;
  forDemo: string;
  verifyAndContinue: string;
  verifying: string;
  or: string;
  changeNumber: string;
  yourName: string;
  howCoachAddress: string;
  letsBegin: string;
  termsPrivacy: string;
  validMobile: string;
  incorrectOtp: string;
  tellUsName: string;
  otpSentTo: string;
}> = {
  en: {
    welcomeToUdaan: "Welcome to Udaan",
    verifyNumber: "Verify your number",
    almostThere: "Almost there!",
    tagline: "उड़ान: Your skill. Your business. Your flight.\nEnter your mobile number to get started.",
    sentOtp: "We sent a 6-digit OTP to",
    whatToCall: "What do you want to be called?\nहम आपको क्या बुलाएँ?",
    enterMobile: "Enter 10-digit mobile number",
    willReceiveOtp: "You will receive a one-time password via SMS",
    sendOtp: "Send OTP",
    sending: "Sending…",
    forDemo: "For demo, enter: 1 2 3 4 5 6",
    verifyAndContinue: "Verify & Continue",
    verifying: "Verifying…",
    or: "or",
    changeNumber: "Change number",
    yourName: "Your name / आपका नाम",
    howCoachAddress: "This is how your coach will address you",
    letsBegin: "Let's Begin! 🪁",
    termsPrivacy: "By continuing, you agree to Udaan's Terms & Privacy",
    validMobile: "Please enter a valid 10-digit mobile number.",
    incorrectOtp: "Incorrect OTP. (Hint: use 123456)",
    tellUsName: "Please tell us what you'd like to be called.",
    otpSentTo: "OTP sent to",
  },
  hi: {
    welcomeToUdaan: "उड़ान में आपका स्वागत है",
    verifyNumber: "अपना नंबर वेरिफाई करें",
    almostThere: "लगभग हो गया!",
    tagline: "उड़ान: आपका हुनर। आपका बिज़नेस। आपकी उड़ान।\nशुरू करने के लिए अपना मोबाइल नंबर डालें।",
    sentOtp: "हमने 6-अंकों का OTP भेजा है",
    whatToCall: "आप क्या कहलाना चाहती हैं?\nहम आपको क्या बुलाएँ?",
    enterMobile: "10-अंकों का मोबाइल नंबर डालें",
    willReceiveOtp: "आपको SMS से एक OTP मिलेगा",
    sendOtp: "OTP भेजें",
    sending: "भेज रहे हैं…",
    forDemo: "डेमो के लिए डालें: 1 2 3 4 5 6",
    verifyAndContinue: "वेरिफाई करें",
    verifying: "वेरिफाई हो रहा है…",
    or: "या",
    changeNumber: "नंबर बदलें",
    yourName: "आपका नाम",
    howCoachAddress: "आपका कोच आपको इसी नाम से बुलाएगा",
    letsBegin: "चलिए शुरू करें! 🪁",
    termsPrivacy: "जारी रखकर, आप उड़ान की शर्तों और गोपनीयता से सहमत हैं",
    validMobile: "कृपया वैध 10-अंकों का मोबाइल नंबर डालें।",
    incorrectOtp: "गलत OTP। (संकेत: 123456 डालें)",
    tellUsName: "कृपया बताएं आप क्या कहलाना पसंद करेंगी।",
    otpSentTo: "OTP भेजा गया",
  },
  bn: {
    welcomeToUdaan: "উড়ানে স্বাগতম",
    verifyNumber: "আপনার নম্বর ভেরিফাই করুন",
    almostThere: "প্রায় হয়ে গেছে!",
    tagline: "উড়ান: আপনার দক্ষতা। আপনার ব্যবসা। আপনার উড়ান।\nশুরু করতে আপনার মোবাইল নম্বর দিন।",
    sentOtp: "আমরা 6-সংখ্যার OTP পাঠিয়েছি",
    whatToCall: "আপনাকে কী বলে ডাকব?\nহম আপকো ক্যা বুলায়েঁ?",
    enterMobile: "10-সংখ্যার মোবাইল নম্বর দিন",
    willReceiveOtp: "আপনি SMS এ একটি OTP পাবেন",
    sendOtp: "OTP পাঠান",
    sending: "পাঠাচ্ছি…",
    forDemo: "ডেমোর জন্য দিন: 1 2 3 4 5 6",
    verifyAndContinue: "ভেরিফাই করুন",
    verifying: "ভেরিফাই হচ্ছে…",
    or: "অথবা",
    changeNumber: "নম্বর বদলান",
    yourName: "আপনার নাম",
    howCoachAddress: "আপনার কোচ আপনাকে এই নামে সম্বোধন করবে",
    letsBegin: "শুরু করা যাক! 🪁",
    termsPrivacy: "চালিয়ে যেতে, আপনি উড়ানের শর্তাবলী ও গোপনীয়তায় সম্মত",
    validMobile: "অনুগ্রহ করে বৈধ 10-সংখ্যার মোবাইল নম্বর দিন।",
    incorrectOtp: "ভুল OTP। (ইঙ্গিত: 123456 দিন)",
    tellUsName: "অনুগ্রহ করে বলুন আপনাকে কী বলে ডাকতে পছন্দ করবেন।",
    otpSentTo: "OTP পাঠানো হয়েছে",
  },
  ml: {
    welcomeToUdaan: "ഉഡാനിലേക്ക് സ്വാഗതം",
    verifyNumber: "നിങ്ങളുടെ നമ്പർ വെരിഫൈ ചെയ്യുക",
    almostThere: "ഏതാണ്ട് ആയി!",
    tagline: "ഉഡാൻ: നിങ്ങളുടെ കഴിവ്. നിങ്ങളുടെ ബിസിനസ്. നിങ്ങളുടെ പറക്കൽ.\nആരംഭിക്കാൻ നിങ്ങളുടെ മൊബൈൽ നമ്പർ നൽകുക.",
    sentOtp: "ഞങ്ങൾ 6-അക്ക OTP അയച്ചു",
    whatToCall: "നിങ്ങളെ എന്ത് വിളിക്കണം?\nहम आपको क्या बुलाएँ?",
    enterMobile: "10-അക്ക മൊബൈൽ നമ്പർ നൽകുക",
    willReceiveOtp: "നിങ്ങൾക്ക് SMS വഴി ഒരു OTP ലഭിക്കും",
    sendOtp: "OTP അയയ്ക്കുക",
    sending: "അയയ്ക്കുന്നു…",
    forDemo: "ഡെമോയ്ക്ക് നൽകുക: 1 2 3 4 5 6",
    verifyAndContinue: "വെരിഫൈ ചെയ്യുക",
    verifying: "വെരിഫൈ ചെയ്യുന്നു…",
    or: "അല്ലെങ്കിൽ",
    changeNumber: "നമ്പർ മാറ്റുക",
    yourName: "നിങ്ങളുടെ പേര്",
    howCoachAddress: "നിങ്ങളുടെ കോച്ച് നിങ്ങളെ ഈ പേരിൽ വിളിക്കും",
    letsBegin: "തുടങ്ങാം! 🪁",
    termsPrivacy: "തുടരുന്നതിലൂടെ, നിങ്ങൾ ഉഡാന്റെ നിബന്ധനകളും സ്വകാര്യതയും അംഗീകരിക്കുന്നു",
    validMobile: "ദയവായി സാധുവായ 10-അക്ക മൊബൈൽ നമ്പർ നൽകുക.",
    incorrectOtp: "തെറ്റായ OTP. (സൂചന: 123456 നൽകുക)",
    tellUsName: "നിങ്ങളെ എന്ത് വിളിക്കണമെന്ന് ദയവായി പറയുക.",
    otpSentTo: "OTP അയച്ചു",
  },
};
