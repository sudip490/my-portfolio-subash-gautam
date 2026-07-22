"use client";

/* Floating color-theme picker, bottom right on every page.

   Selecting a theme sets data-theme on <html>, which re-points the CSS
   color tokens in globals.css — accent AND the ink background trio — so
   the whole site recolors at once. The choice persists in localStorage
   and is re-applied before first paint by the inline script in
   layout.tsx, so a themed visitor never sees a cobalt flash. */

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const THEMES = [
  { id: "cobalt", label: "Cobalt", accent: "#2563eb" },
  { id: "emerald", label: "Emerald", accent: "#059669" },
  { id: "violet", label: "Violet", accent: "#7c3aed" },
  { id: "amber", label: "Amber", accent: "#d97706" },
  { id: "rose", label: "Rose", accent: "#e11d48" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  /* The real theme is on <html> before hydration; read it after mount so
     the server render (which can't know it) never mismatches. */
  const [active, setActive] = useState<ThemeId>("cobalt");

  useEffect(() => {
    const current = document.documentElement.dataset.theme as ThemeId | undefined;
    if (current && THEMES.some((t) => t.id === current)) setActive(current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const apply = (id: ThemeId) => {
    setActive(id);
    setOpen(false);
    try {
      if (id === "cobalt") {
        delete document.documentElement.dataset.theme;
        localStorage.removeItem("theme");
      } else {
        document.documentElement.dataset.theme = id;
        localStorage.setItem("theme", id);
      }
    } catch {
      /* Storage unavailable (private mode) — the theme still applies
         for this visit, it just won't survive a reload. */
    }
  };

  return (
    <div className="no-print fixed right-5 bottom-5 z-50 flex flex-col items-end gap-2 md:right-8 md:bottom-8">
      <AnimatePresence>
        {open && (
          <motion.ul
            className="flex flex-col gap-2 border border-ink-line bg-ink-soft/90 p-2 backdrop-blur-md"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {THEMES.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => apply(t.id)}
                  aria-label={`${t.label} theme`}
                  aria-pressed={active === t.id}
                  title={t.label}
                  className={`flex h-7 w-7 cursor-pointer items-center justify-center border transition-colors ${
                    active === t.id
                      ? "border-paper"
                      : "border-transparent hover:border-ink-line"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: t.accent }}
                  />
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Choose color theme"
        aria-expanded={open}
        className="flex h-10 w-10 cursor-pointer items-center justify-center border border-ink-line bg-ink-soft/90 backdrop-blur-md transition-colors hover:border-paper"
      >
        {/* The button wears the live token, so it always shows the
            current accent without knowing which theme is active. */}
        <span className="h-3.5 w-3.5 rounded-full bg-accent" />
      </button>
    </div>
  );
}
