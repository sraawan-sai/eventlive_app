/** Package definitions shown on /pricing. Prices are before 18% GST. Limits are not enforced in the app yet. */
export interface Package {
  id: string;
  name: string;
  price: number; // INR, before GST
  unit: string; // "per event" | "per month"
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
    features: ["Event website and share link", "Live stream for up to 20 viewers", "1 hour of live video", "Data-saver video quality", "1 GB for photos and card", "QR code and WhatsApp preview"],
  },
  {
    id: "basic",
    name: "Basic",
    price: 499,
    unit: "per event",
    tagline: "For birthdays and small poojas.",
    features: ["Live stream for up to 40 viewers", "2 hours of live video", "Data-saver video (480p)", "2 GB for photos, card and video", "Telugu and Hindi text", "Scrolling message under the video"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 1999,
    unit: "per event",
    tagline: "For weddings and family functions.",
    popular: true,
    features: ["Live stream for up to 100 viewers", "3 hours of live video", "HD video (720p)", "5 GB for photos, card and video", "Background music and gallery", "Telugu and Hindi text"],
  },
  {
    id: "plus",
    name: "Plus",
    price: 4999,
    unit: "per event",
    tagline: "For large functions and halls.",
    features: ["Live stream for up to 300 viewers", "4 hours of live video", "Data saver by default, HD on request", "10 GB for photos, card and video", "Sponsors section for community events", "Priority help on the event day"],
  },
  {
    id: "mega",
    name: "Mega",
    price: 14999,
    unit: "per event",
    tagline: "For festivals and big public events.",
    features: ["Live stream for up to 1,000 viewers", "4 hours of live video", "Data-saver video, HD on request", "20 GB for photos, card and video", "Server set up and tested for your event", "Setup call before the day"],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: 9999,
    unit: "per month",
    tagline: "For temples, trusts and event companies.",
    features: ["Unlimited events, fair use", "Up to 200 viewers per event", "Up to 6 hours per event", "About 500 GB of video a month", "50 GB for photos, cards and videos", "Audio-first mode for big devotional events"],
  },
];

export const ADDONS: { name: string; price: number }[] = [
  { name: "+50 viewers", price: 299 },
  { name: "HD upgrade for Mega", price: 10000 },
  { name: "Extra live hour", price: 150 },
  { name: "HD upgrade (Basic or Plus)", price: 500 },
  { name: "Extra 10 GB of files", price: 99 },
];
