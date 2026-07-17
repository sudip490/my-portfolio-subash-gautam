"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/data/content";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Open Source", href: "#open-source" },
  { label: "Contact", href: "#contact" },
];

export function Nav({ ready = true }: { ready?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mobile menu — expected of any disclosure widget.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const menuItems = site.resumeUrl
    ? [...links, { label: "Resume", href: site.resumeUrl }]
    : links;

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={ready ? { y: 0 } : { y: -80 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-ink-line bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        {/* The avatar is the mark — this site has no logo, and a face beside
            the name does more work than a monogram would. */}
        <a
          href="#top"
          className="group type-label flex items-center gap-3 text-paper hover:text-accent-bright"
        >
          <Image
            src={site.photo}
            alt=""
            width={800}
            height={800}
            /* Loads in the nav, above the fold, so it's worth the priority
               hint — it's ~2KB at this size. */
            priority
            sizes="2rem"
            aria-hidden
            className="h-8 w-8 rounded-full border border-ink-line object-cover transition-colors duration-300 group-hover:border-accent-bright"
          />
          {site.name}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="type-label cursor-pointer text-paper-dim transition-colors duration-200 hover:text-paper"
              >
                {link.label}
              </a>
            </li>
          ))}
          {/* Only rendered once a resume actually exists in /public. */}
          {site.resumeUrl && (
            <li>
              <a
                href={site.resumeUrl}
                className="type-label cursor-pointer border border-paper px-4 py-2 text-paper transition-colors duration-200 hover:bg-paper hover:text-ink"
              >
                Resume
              </a>
            </li>
          )}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="type-label cursor-pointer text-paper md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* AnimatePresence so the menu animates out, not just in. */}
      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-ink-line bg-ink px-6 md:hidden"
          >
            {menuItems.map((link) => (
              <li key={link.href} className="border-b border-ink-line last:border-0">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="type-label block cursor-pointer py-5 text-paper"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
