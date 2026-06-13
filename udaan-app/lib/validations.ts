import { z } from "zod";

// ─── /api/session POST ───────────────────────────────────────────────────────

export const SessionEventSchema = z.object({
  sessionId: z.string().min(1).max(64),
  type: z.enum([
    "session_start",
    "interview_answer",
    "kit_generated",
    "whatsapp_copied",
  ]),
  payload: z.unknown().optional(),
});

export type SessionEventInput = z.infer<typeof SessionEventSchema>;

// ─── /api/coach POST ─────────────────────────────────────────────────────────

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

export const CoachRequestSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, "At least one message is required.")
    .max(20, "Conversation too long."),
});

export type CoachRequestInput = z.infer<typeof CoachRequestSchema>;
