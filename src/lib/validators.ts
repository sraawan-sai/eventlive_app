import { z } from "zod";
import { EVENT_TYPES } from "@/lib/event-types";
import { TEMPLATE_IDS } from "@/lib/templates";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(72),
});

export const eventSchema = z.object({
  name: z.string().trim().min(2, "Enter an event title").max(120),
  type: z.enum(EVENT_TYPES),
  hostOne: optionalText(80),
  hostTwo: optionalText(80),
  description: optionalText(2000),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  startTime: time,
  endTime: time,
  venueName: optionalText(120),
  venueAddress: optionalText(300),
  coverImageUrl: z
    .string()
    .trim()
    .url("Must be a valid https:// URL")
    .refine((u) => u.startsWith("https://") || u.startsWith("http://"), "Must be http(s)")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  template: z.enum(TEMPLATE_IDS),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only")
    .max(60)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type EventInput = z.infer<typeof eventSchema>;

export const scheduleItemSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: optionalText(300),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  endTime: time,
});

export const scheduleSchema = z.array(scheduleItemSchema).max(30);
