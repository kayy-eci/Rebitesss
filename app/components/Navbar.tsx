"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/lib/scroll";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "flash-sale", label: "Flash Sale" },
  { id: "kategori", label: "Kategori" },
  { id: "rekomendasi-makanan", label: "Rekomendasi" },
  { id: "umkm", label: "UMKM" },
  { id: "langganan", label: "Langganan" },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

export function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const darkIds = ["flash-sale", "footer"];
    const darkEls = darkIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (darkEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => setOverDark(entries.some((e) => e.isIntersecting)),
      { rootMargin: "0px 0px -65% 0px" },
    );

    darkEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNav = (id: string) => {
    setOpen(false);
    setActive(id);
    scrollToId(id);
  };

  const IconButton = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200",
        overDark
          ? "text-white/80 hover:bg-white/10 hover:text-white"
          : "text-charcoal-500 hover:bg-cream-100 hover:text-green-700",
        FOCUS_RING,
      )}
    >
      {children}
    </button>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 pt-3 sm:px-8 sm:pt-4">
      <div className="mx-auto w-full max-w-[1200px]">
        <nav
          className={cn(
            "flex h-16 items-center justify-between rounded-full border px-5 shadow-[0_20px_44px_-26px_rgba(34,81,56,0.45)] backdrop-blur-xl transition-colors duration-500 sm:px-6 lg:px-8",
            overDark
              ? "border-white/15 bg-transparent text-white"
              : "border-hairline/70 bg-transparent text-forest-dark",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="ReBites"
            className="flex shrink-0 items-center gap-2.5"
          >
            <img
              src="/logo.png"
              alt="ReBites"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="font-display text-2xl font-medium tracking-tight">
              <span className="font-display text-2xl font-medium text-primary-foreground-strong">
                Re
              </span>
              <span className="font-display text-2xl font-light italic text-primary-foreground-strong">
                Bites
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id} className="relative">
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.id);
                  }}
                  aria-current={active === link.id ? "page" : undefined}
                  className={cn(
                    "relative py-1 font-sans text-sm transition-colors duration-300",
                    active === link.id
                      ? overDark
                        ? "font-semibold text-white"
                        : "font-semibold text-forest-dark"
                      : overDark
                        ? "text-white/80 hover:text-white"
                        : "text-forest-dark/80 hover:text-caramel",
                    FOCUS_RING,
                  )}
                >
                  {link.label}

                  {active === link.id && (
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full transition-colors duration-500",
                        overDark ? "bg-white" : "bg-caramel",
                      )}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-0.5">
            {/* Icon actions */}
            <div className="hidden items-center gap-0.5 sm:flex">
              <IconButton label="Notifikasi">
                <Bell className="h-5 w-5" />
              </IconButton>
              <IconButton label="Profil saya">
                <User className="h-5 w-5" />
              </IconButton>
            </div>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              className={cn(
                "flex h-10 w-10 items-center justify-center lg:hidden",
                overDark ? "text-white" : "text-forest",
                FOCUS_RING,
              )}
            >
              {open ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 overflow-hidden rounded-3xl border border-hairline/70 bg-white p-3 shadow-[0_28px_56px_-28px_rgba(34,81,56,0.5)] lg:hidden"
            >
              <ul className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(link.id);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 font-sans text-sm transition-colors duration-300",
                        active === link.id
                          ? "bg-caramel/10 font-semibold text-forest-dark"
                          : "text-forest-dark hover:bg-cream",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
