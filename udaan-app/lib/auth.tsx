"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserProfile = {
  phone: string;
  name?: string;
  location?: string;
  sessionId: string;
  createdAt: number;
  hasCompletedCoach?: boolean;
  kitGenerated?: boolean;
};

type AuthContextType = {
  user: UserProfile | null;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "udaan_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  function login(phone: string, name?: string) {
    const newUser: UserProfile = {
      phone,
      name: name || undefined,
      sessionId: "s-" + Math.random().toString(36).slice(2, 10),
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    seedWelcomeNotification(name);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setUser(updated);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, isLoggedIn: !!user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export type AppNotification = {
  id: string;
  emoji: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: "welcome" | "motivation" | "milestone" | "community" | "reminder";
};

const NOTIF_KEY = "udaan_notifications";

export function getNotifications(): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addNotification(
  n: Omit<AppNotification, "id" | "timestamp" | "read">
): AppNotification {
  const notifs = getNotifications();
  const newN: AppNotification = {
    ...n,
    id: Math.random().toString(36).slice(2),
    timestamp: Date.now(),
    read: false,
  };
  localStorage.setItem(NOTIF_KEY, JSON.stringify([newN, ...notifs].slice(0, 30)));
  return newN;
}

export function markAllRead() {
  const notifs = getNotifications().map((n) => ({ ...n, read: true }));
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
}

function seedWelcomeNotification(name?: string) {
  const existing = getNotifications();
  if (existing.length > 0) return;
  const greeting = name ? `Welcome to Udaan, ${name}!` : "Welcome to Udaan!";
  const personalBody = name
    ? `${name}, you just took the first step of a thousand. The women who changed their lives started exactly here — with one tap. Your journey begins now, didi!`
    : "You just took the first step of a thousand. The women who changed their lives started exactly here — with one tap. Your journey begins now, didi!";
  addNotification({
    type: "welcome",
    emoji: "🦸‍♀️",
    title: greeting,
    body: personalBody,
  });
  addNotification({
    type: "motivation",
    emoji: "✨",
    title: "Today's Power Message",
    body: "Every big business started as someone's side hustle. Your skill is your superpower — Udaan is here to help you turn it into income. Let's fly!",
  });
}

export const DAILY_NUDGES = [
  {
    emoji: "💪",
    title: "You're a Superwoman!",
    body: "Women-owned businesses in India are growing 3x faster. You are that statistic. What skill are you sharing with the world today?",
  },
  {
    emoji: "🌟",
    title: "Your Goals Are Waiting",
    body: "Every ₹ you earn is a brick in the house you're building for your family. Talk to your coach today.",
  },
  {
    emoji: "🎯",
    title: "One Small Step Today",
    body: "The didi who sent 5 WhatsApp messages last week has 3 orders this week. Small action, big result.",
  },
  {
    emoji: "👑",
    title: "Business Queen Alert",
    body: "You have a skill that someone desperately needs right now. They just haven't found you yet. Let's change that today!",
  },
  {
    emoji: "🌸",
    title: "Your Success Story Starts Today",
    body: "Priya from Lucknow started with 5 tiffins a day. Meera from Pune started with 2 stitch orders. You can start with 1.",
  },
];
