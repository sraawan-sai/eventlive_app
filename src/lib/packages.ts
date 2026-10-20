/** Package definitions shown on /pricing. Prices are before 18% GST. Limits are not enforced in the app yet. */
export interface Package {
  id: string;
  name: string;
  price: number; // INR, before GST
  unit: string;
  tagline: string;
  popular?: boolean;
  features: string[];
}

export const PACKAGES: Package[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    unit: "to try",
    tagline: "Try Eventra with a small group.",
    features: ["Event website and share link", "Live stream for up to 20 viewers", "1 hour of live video", "1 GB for photos and card", "QR code and WhatsApp preview"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 499,
    unit: "per event",
    tagline: "For a small gathering or a first live event.",
    features: ["Live stream for up to 30 viewers", "2 hours of live video", "Data-saver video quality", "2 GB for photos and card", "Telugu and Hindi text", "QR code and WhatsApp preview"],
  },
  {
    id: "basic",
    name: "Basic",
    price: 999,
    unit: "per event",
    tagline: "For birthdays, naming ceremonies and small poojas.",
    features: ["Live stream for up to 50 viewers", "2 hours of live video", "Data-saver video quality", "3 GB for photos, card and video", "Telugu and Hindi text", "Scrolling message under the video"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 2999,
    unit: "per event",
    tagline: "For weddings and family functions.",
    popular: true,
    features: ["Live stream for up to 100 viewers", "4 hours of live video", "HD video (720p)", "10 GB for photos, card and video", "Gallery, background music and QR code", "Telugu and Hindi text"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 7999,
    unit: "per event",
    tagline: "For large functions, halls and community events.",
    features: ["Live stream for up to 300 viewers", "5 hours of live video", "Data saver by default, HD on request", "20 GB for photos, card and video", "Sponsors section for community events", "Priority help on the event day"],
  },
];

export const ADDONS: { name: string; price: number }[] = [
  { name: "+50 viewers", price: 399 },
  { name: "Extra live hour", price: 199 },
  { name: "HD upgrade (Basic or Premium)", price: 799 },
  { name: "Extra 10 GB of files", price: 149 },
];

/** Big events are quoted one by one so the price matches the real cost. */
export const CUSTOM_EVENTS = {
  title: "Festivals, temples and large events",
  text: "Hundreds or thousands of viewers, multi-day festivals, monthly plans for temples and event companies, and charity events. Tell us about your event and we'll send a quote.",
  points: ["Up to 1,000 viewers or more", "Multi-day and monthly plans", "Audio-first mode for big devotional events", "Server tested before the day"],
};
