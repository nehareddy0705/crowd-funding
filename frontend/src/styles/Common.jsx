// src/styles/Common.jsx
// Theme: Fresh Peach with Terracotta Accent

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-brand-bg min-h-screen text-brand-body";
export const pageWrapper = "max-w-7xl mx-auto px-6 py-16";
export const section = "mb-20";

// ─── Navigation ───────────────────────────────────────
export const navbar = "border-b border-peach-light bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm";
export const navContainer = "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between";
export const navBrand = "text-2xl font-black tracking-wide text-brand-charcoal uppercase hover:opacity-90 transition-opacity";
export const navLinks = "flex items-center gap-8";
export const navLink = "text-sm font-semibold text-brand-body hover:text-peach-terracotta transition-colors duration-300";
export const navLinkActive = "text-sm font-bold text-peach-terracotta border-b-2 border-peach-terracotta";

// ─── Cards ────────────────────────────────────────────
export const card = "bg-white border border-peach-light/40 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-peach-coral/50 hover:-translate-y-0.5";
export const campaignCard = "bg-white rounded-2xl overflow-hidden border border-peach-light/45 hover:shadow-xl transition-all duration-300 hover:border-peach-coral/50 hover:-translate-y-1";
export const articleCard = "bg-white border border-peach-light/40 rounded-2xl p-6 hover:shadow-md transition-all duration-300";
export const articleTitle = "text-lg font-bold text-brand-charcoal leading-snug";
export const articleExcerpt = "text-sm text-brand-body leading-relaxed";
export const articleMeta = "text-xs uppercase tracking-widest text-brand-charcoal/70 font-semibold";
export const emptyState = "rounded-2xl border-2 border-dashed border-peach-light bg-white px-8 py-12 text-center text-sm text-brand-body";
export const statusActive = "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700";
export const statusPending = "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700";
export const statusRejected = "inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700";

// ─── Typography ───────────────────────────────────────
export const pageTitle = "text-4xl md:text-5xl lg:text-6xl font-black text-brand-charcoal tracking-tight leading-tight mb-4";
export const heading = "text-3xl font-black text-brand-charcoal tracking-tight";
export const subHeading = "text-xl font-bold text-brand-charcoal tracking-tight";
export const heading2 = "text-2xl font-extrabold text-brand-charcoal";
export const body = "text-brand-body leading-relaxed text-base";
export const bodySmall = "text-sm text-brand-body/80 leading-relaxed";
export const muted = "text-sm text-brand-body/60";
export const link = "text-peach-terracotta font-bold hover:text-peach-coral transition-colors";

// ─── Buttons ──────────────────────────────────────────
export const btnPrimary = "inline-flex items-center justify-center bg-peach-terracotta text-white font-extrabold px-8 py-3.5 rounded-xl hover:bg-peach-terracotta/90 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-peach-coral/30 transition-all duration-300 text-sm shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60";
export const btnSecondary = "inline-flex items-center justify-center border-2 border-peach-terracotta bg-white text-peach-terracotta font-extrabold px-8 py-3.5 rounded-xl hover:bg-peach-light/20 focus:outline-none focus:ring-4 focus:ring-peach-coral/20 transition-all duration-300 text-sm";
export const btnOnDark = "inline-flex items-center justify-center bg-white text-brand-charcoal font-extrabold px-8 py-3.5 rounded-xl hover:bg-peach-light/10 focus:outline-none focus:ring-4 focus:ring-white/40 transition-all duration-300 text-sm shadow-sm hover:scale-[1.02]";
export const btnOutlineOnDark = "inline-flex items-center justify-center border-2 border-white/80 text-white font-extrabold px-8 py-3.5 rounded-xl hover:bg-white hover:text-brand-charcoal focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 text-sm";
export const btnTertiary = "inline-flex items-center justify-center bg-peach-light text-brand-charcoal font-extrabold px-6 py-2.5 rounded-xl hover:bg-peach-coral/80 transition-all duration-300 text-sm";
export const btnGhost = "text-peach-terracotta font-bold hover:text-peach-coral transition-colors text-sm";
export const btnDanger = "bg-rose-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-rose-600 transition-all text-sm";

// ─── Forms ────────────────────────────────────────────
export const formCard = "bg-white rounded-3xl p-8 md:p-12 max-w-2xl mx-auto border border-peach-light/30 shadow-lg";
export const formTitle = "text-3xl font-black text-brand-charcoal text-center mb-3";
export const label = "text-sm font-semibold text-brand-charcoal/80 mb-2 block";
export const input = "w-full bg-brand-bg/50 border border-peach-light/65 rounded-xl px-4 py-3.5 text-brand-charcoal text-sm placeholder:text-brand-body/40 focus:outline-none focus:border-peach-terracotta focus:ring-4 focus:ring-peach-coral/20 transition-all";
export const textarea = "w-full bg-brand-bg/50 border border-peach-light/65 rounded-xl px-4 py-3.5 text-brand-charcoal text-sm placeholder:text-brand-body/40 focus:outline-none focus:border-peach-terracotta focus:ring-4 focus:ring-peach-coral/20 transition-all resize-none";
export const formGroup = "mb-6";
export const divider = "border-t border-peach-light/40 my-6";
export const error = "text-xs text-rose-600 mt-1 font-semibold";
export const success = "text-xs text-emerald-600 mt-1 font-semibold";
export const submit = "w-full bg-peach-terracotta text-white font-extrabold py-3.5 rounded-xl hover:bg-peach-terracotta/90 transition-all duration-300 mt-4 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-60 hover:scale-[1.01]";
export const loading = "text-sm text-brand-body/70 mt-4 text-center animate-pulse";

// ─── Campaign Listing ──────────────────────────────────
export const campaignGrid = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
export const campaignImage = "w-full h-48 object-cover bg-peach-light/20";
export const campaignMeta = "text-xs uppercase tracking-widest text-peach-terracotta font-extrabold";
export const campaignAmount = "text-2xl font-black text-peach-terracotta";
export const progressBar = "bg-peach-light/40 rounded-full h-2.5 overflow-hidden";
export const progressFill = "bg-peach-gold h-full transition-all duration-500";
