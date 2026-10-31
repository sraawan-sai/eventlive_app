/** Full terms, in English (the official version). Short summaries in Telugu and Hindi are in src/lib/ui-text.ts. */
export const TERMS_UPDATED = "31 October 2026";

export interface TermsSection {
  title: string;
  /** Paragraphs shown first. */
  paras?: string[];
  /** Bullet points shown after the paragraphs. */
  bullets?: string[];
}

export const TERMS: TermsSection[] = [
  {
    title: "Agreeing to these terms",
    paras: [
      'These terms apply when you visit or use Eventra (the "service"), whether you are a host who creates an event or a guest who watches one. By creating an account or using the service you agree to them. If you do not agree, please do not use the service.',
    ],
  },
  {
    title: "Your account",
    bullets: [
      "Give correct details and keep your password and sign-in secure. You are responsible for what happens under your account.",
      "You must be at least 18 years old, or use Eventra with the permission of a parent or guardian.",
      "Guests who only watch an event do not need an account.",
      "Tell us right away if you think someone else is using your account.",
    ],
  },
  {
    title: "What Eventra provides",
    paras: [
      "Eventra lets hosts create event websites from templates, share them with a link and QR code, add photos, an invitation card, videos, background music and sponsor logos, and stream live video that guests watch in a web browser. Features, templates and limits may change over time.",
    ],
  },
  {
    title: "Packages, prices and payment",
    bullets: [
      "The packages (Free, Starter, Basic, Pro and Premium) and their limits are listed on the Pricing page. Each package sets how many guests can watch at the same time, how long you can be live for each event, and how much storage your files can use.",
      "Prices are in Indian rupees, per event, and are shown before 18% GST unless we say otherwise.",
      "At present you pay by UPI after contacting us on WhatsApp. We switch on your package after we confirm your payment. Packages do not renew automatically.",
      "Very large events and monthly plans are quoted separately and agreed with you before you pay.",
      "If you reach a limit, a live stream may stop or an upload may be refused until you upgrade or free up space.",
      "We may change prices or packages. A change does not affect a package you have already paid for.",
    ],
  },
  {
    title: "Refunds",
    paras: [
      "Payments are not refunded once a package has been switched on, except where we are unable to provide the service you paid for. If there is a problem, contact us as early as you can, ideally before your event, and we will try to fix it or agree a fair solution with you.",
    ],
  },
  {
    title: "Your content",
    bullets: [
      "You keep ownership of everything you upload or stream: text, photos, videos, music, logos and live video.",
      "You give us permission to store, display and transmit it as needed to run the service, for example to show your event page and live stream to your guests.",
      "You promise that you have the right to use everything you upload or stream, including photos of people and any music, and that it does not break anyone else's rights or the law.",
      "You are responsible for getting permission from the people who appear in your photos, videos or live stream.",
    ],
  },
  {
    title: "Acceptable use",
    paras: ["You must not use Eventra to:"],
    bullets: [
      "break the law, or help anyone else to;",
      "share hateful, threatening, harassing, sexually explicit or violent content, or anything that exploits children;",
      "upload or stream material you do not have the right to use, including copyrighted music;",
      "pretend to be another person or organisation;",
      "send spam or scams, or collect other people's personal data;",
      "upload malware, or attack, overload or try to get around the security or limits of the service; or",
      "use fake accounts or automated tools to get free packages or avoid limits.",
    ],
  },
  {
    title: "Live streaming",
    bullets: [
      "You are responsible for everything you broadcast.",
      "We do not record your live stream. We cannot promise that every guest will be able to watch: video quality depends on your connection and on each guest's connection.",
      "A stream ends automatically when the live time of your package is used up, or if your device stops sending video for a while.",
    ],
  },
  {
    title: "Your data",
    paras: [
      "We keep the details you give us (such as your name and email), your events and files, and a record of when you sign in. We use them to run the service, to keep it secure and, where needed, to contact you about your account or a payment. We do not sell your personal data.",
      "We use services from other companies to provide Eventra, including for hosting, the database, file storage, live video and Google sign-in. We use a cookie to keep you signed in, and your device's storage to remember your language choice.",
      "You can delete your account and your files at any time from Profile & Settings. Doing so removes your events and uploaded files permanently.",
    ],
  },
  {
    title: "Availability",
    paras: [
      "We try to keep Eventra running, but we cannot promise that it will always be available or free of errors. We may pause the service for maintenance or changes. For an important event, plan a back-up, such as a second phone with a good connection.",
    ],
  },
  {
    title: "Suspension and ending",
    paras: [
      "You can stop using Eventra and delete your account at any time. We may remove content, limit features, or suspend or close an account if you break these terms, put other people at risk, or the law requires it. Where we reasonably can, we will tell you first.",
    ],
  },
  {
    title: "Our responsibility",
    paras: [
      "Eventra is provided as it is. As far as the law allows, we are not responsible for losses caused by things outside our control (such as internet or power failures, or problems with other companies' services), or for indirect losses, such as a missed event or lost opportunity.",
      "Our total responsibility for any claim about a package is limited to the amount you paid for that package. Nothing in these terms limits any right you have under the law that cannot be limited.",
    ],
  },
  {
    title: "Claims about your content",
    paras: [
      "If your content or your live stream leads to a claim against us, you agree to help resolve it and to cover the reasonable costs that result from your breaking these terms.",
    ],
  },
  {
    title: "Changes to these terms",
    paras: [
      "We may update these terms. The date at the top of this page shows when they last changed. If you keep using Eventra after a change, you accept the new terms. For important changes we will try to tell you in advance.",
    ],
  },
  {
    title: "Governing law",
    paras: [
      "These terms are governed by the laws of India. We hope to settle any problem by talking first, so please contact us. If we cannot, the courts with jurisdiction in India will decide.",
    ],
  },
  {
    title: "Contact us",
    paras: ["Message us on WhatsApp about payments and packages, or on Instagram for any other question. Our details are below."],
  },
];
