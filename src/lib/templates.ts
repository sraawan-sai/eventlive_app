export const TEMPLATE_IDS = ["elegant", "modern", "minimal", "classic"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

/**
 * A template is pure styling data. One <EventSite> renders every template,
 * so event + template = rendered website with no per-template page copies.
 */
export interface TemplateTheme {
  id: TemplateId;
  name: string;
  description: string;
  page: string;
  navBar: string;
  heroWrap: string;
  heroOverlay: string;
  heroText: string;
  headline: string;
  tagline: string;
  date: string;
  section: string;
  sectionTitle: string;
  card: string;
  muted: string;
  accent: string;
  button: string;
  buttonGhost: string;
  countdownBox: string;
  /** Swatch colours for the picker thumbnail. */
  swatch: [string, string, string];
}

export const TEMPLATES: Record<TemplateId, TemplateTheme> = {
  elegant: {
    id: "elegant",
    name: "Elegant Wedding",
    description: "Large photography, romantic serif typography.",
    page: "bg-[#fbf6ef] text-[#3b2a2a]",
    navBar: "bg-[#fbf6ef]/90 text-[#3b2a2a] border-b border-[#c9a45c]/30",
    heroWrap: "min-h-[92svh]",
    heroOverlay: "bg-gradient-to-b from-black/30 via-black/40 to-black/60",
    heroText: "text-white",
    headline: "font-serif italic text-5xl sm:text-7xl md:text-8xl leading-tight",
    tagline: "font-serif tracking-[0.3em] uppercase text-xs sm:text-sm",
    date: "font-serif text-xl sm:text-2xl tracking-widest",
    section: "py-16 sm:py-24 px-5",
    sectionTitle: "font-serif text-3xl sm:text-4xl text-center text-[#7a2e3a] mb-10",
    card: "rounded-none border border-[#c9a45c]/60 bg-white/70 p-6",
    muted: "text-[#7c6a63]",
    accent: "text-[#b08a3c]",
    button: "bg-[#7a2e3a] text-white hover:bg-[#5f2230] rounded-none tracking-widest uppercase text-xs",
    buttonGhost: "border border-[#7a2e3a] text-[#7a2e3a] hover:bg-[#7a2e3a]/10 rounded-none tracking-widest uppercase text-xs",
    countdownBox: "border border-white/50 bg-white/10 backdrop-blur-sm",
    swatch: ["#fbf6ef", "#7a2e3a", "#c9a45c"],
  },
  modern: {
    id: "modern",
    name: "Modern Celebration",
    description: "Bold gradients, clean cards, contemporary type.",
    page: "bg-slate-50 text-slate-900",
    navBar: "bg-white/90 text-slate-900 border-b border-slate-200",
    heroWrap: "min-h-[80svh]",
    heroOverlay: "bg-gradient-to-br from-fuchsia-700/35 via-purple-800/40 to-indigo-900/65",
    heroText: "text-white",
    headline: "font-sans font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight",
    tagline: "font-sans font-semibold uppercase tracking-widest text-xs sm:text-sm",
    date: "font-sans font-medium text-lg sm:text-xl",
    section: "py-14 sm:py-20 px-5",
    sectionTitle: "font-sans font-extrabold text-2xl sm:text-4xl text-center mb-8",
    card: "rounded-3xl bg-white p-6 shadow-lg shadow-purple-900/5 ring-1 ring-slate-200",
    muted: "text-slate-500",
    accent: "text-fuchsia-600",
    button: "bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white hover:opacity-90 rounded-full font-semibold text-sm",
    buttonGhost: "bg-white ring-1 ring-slate-300 text-slate-800 hover:bg-slate-100 rounded-full font-semibold text-sm",
    countdownBox: "rounded-2xl bg-white/15 backdrop-blur-sm",
    swatch: ["#f8fafc", "#c026d3", "#4f46e5"],
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Deep navy and gold, timeless and formal.",
    page: "bg-[#0f1b2d] text-[#f3ead7]",
    navBar: "bg-[#0f1b2d]/90 text-[#f3ead7] border-b border-[#d9b96b]/30",
    heroWrap: "min-h-[85svh]",
    heroOverlay: "bg-gradient-to-b from-[#0f1b2d]/60 via-[#0f1b2d]/50 to-[#0f1b2d]",
    heroText: "text-[#f3ead7]",
    headline: "font-serif text-5xl sm:text-7xl leading-tight",
    tagline: "font-serif tracking-[0.35em] uppercase text-xs sm:text-sm text-[#d9b96b]",
    date: "font-serif text-xl sm:text-2xl tracking-wider text-[#d9b96b]",
    section: "py-16 sm:py-24 px-5",
    sectionTitle: "font-serif text-3xl sm:text-4xl text-center text-[#d9b96b] mb-10",
    card: "rounded-lg border border-[#d9b96b]/40 bg-white/5 p-6",
    muted: "text-[#f3ead7]/70",
    accent: "text-[#d9b96b]",
    button: "bg-[#d9b96b] text-[#0f1b2d] hover:bg-[#c5a455] rounded-md font-semibold text-sm",
    buttonGhost: "border border-[#d9b96b] text-[#d9b96b] hover:bg-[#d9b96b]/10 rounded-md font-semibold text-sm",
    countdownBox: "rounded-lg border border-[#d9b96b]/60 bg-black/20",
    swatch: ["#0f1b2d", "#d9b96b", "#f3ead7"],
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Whitespace and strong typography.",
    page: "bg-white text-neutral-900",
    navBar: "bg-white/90 text-neutral-900 border-b border-neutral-200",
    heroWrap: "min-h-[70svh]",
    heroOverlay: "bg-white/80",
    heroText: "text-neutral-900",
    headline: "font-sans font-black text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tighter uppercase",
    tagline: "font-sans text-xs uppercase tracking-[0.4em]",
    date: "font-sans text-base sm:text-lg tracking-wide",
    section: "py-14 sm:py-20 px-5 border-t border-neutral-200",
    sectionTitle: "font-sans font-black uppercase tracking-tight text-2xl sm:text-3xl mb-8",
    card: "border-b border-neutral-200 py-4",
    muted: "text-neutral-500",
    accent: "text-neutral-900",
    button: "bg-neutral-900 text-white hover:bg-neutral-700 text-sm font-semibold",
    buttonGhost: "border border-neutral-900 text-neutral-900 hover:bg-neutral-100 text-sm font-semibold",
    countdownBox: "border border-neutral-900",
    swatch: ["#ffffff", "#171717", "#a3a3a3"],
  },
};

export const TEMPLATE_LIST = TEMPLATE_IDS.map((id) => TEMPLATES[id]);

export function getTemplate(id: string): TemplateTheme {
  return TEMPLATES[id as TemplateId] ?? TEMPLATES.elegant;
}
