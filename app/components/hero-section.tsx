"use client";

import { useEffect, useState, useId } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import OptionWheel from "@/app/components/ui/korosel";

const FOODS = [
  { name: "Geprek Sambal Bawang", image: "/makanan1.jpeg" },
  { name: "Nasi Goreng Kampung", image: "/makanan2.jpeg" },
  { name: "Soto Mie Bogor", image: "/makanan3.jpeg" },
  { name: "Sate Ayam Pak Tigiset", image: "/makanan4.jpeg" },
  { name: "Rendang Padang Karindang", image: "/makanan5.jpeg" },
  { name: "Pancong Boss Lumer", image: "/makanan6.jpeg" },
  { name: "Martabak Gombret", image: "/makanan7.jpg" },
  { name: "Bakso Spesial Mas Jono", image: "/makanan8.webp" },
  { name: "Ketoprak Telor Sedap", image: "/makanan9.webp" },
  { name: "Mie Ayam Balap 12", image: "/makanan10.webp" },
];

const NAV_LINKS = [
  { href: "/#top", label: "Beranda" },
  { href: "/#rekomendasi", label: "Rekomendasi" },
  { href: "/#about", label: "About Us" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#langganan", label: "Langganan" },
  { href: "/#testimoni", label: "Testimoni" },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export function HeroSection() {
  const [open, setOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>("Beranda");
  const [overDark, setOverDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [foodIndex, setFoodIndex] = useState(0);

  const lang = "id" as "id" | "en";

  const t = (id: string, en: string): string => {
    return lang === "en" ? en : id;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav]"),
    );

    if (sections.length === 0) {
      setOverDark(false);
      return;
    }

    const probeY = 44;

    const update = () => {
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom > probeY;
      });

      if (!current) {
        setOverDark(false);
        return;
      }

      const [r, g, b] = getComputedStyle(current)
        .backgroundColor.match(/\d+/g)
        ?.slice(0, 3)
        .map(Number) ?? [0, 0, 0];
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      setOverDark(luminance < 0.5);

      let label = NAV_LINKS[0].label;
      for (const link of NAV_LINKS) {
        const hash = link.href.split("#")[1];
        const el = hash ? document.getElementById(hash) : null;
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          label = link.label;
        }
      }
      setActiveNav(label);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [mounted]);

  const navIsDark = mounted && overDark;

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
    href: string,
  ) => {
    e.preventDefault();
    setActiveNav(label);
    setOpen(false);
    const hash = href.split("#")[1];
    const target = hash ? document.getElementById(hash) : null;
    if (!target) return;

    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(target, { offset: -88, duration: 1.1 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="overflow-x-hidden bg-cream" data-nav="cream">
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-3 sm:px-8 sm:pt-4">
        <div className="mx-auto w-full max-w-[1200px]">
          <nav
            className={cn(
              "flex h-16 items-center justify-between rounded-full border px-5 shadow-[0_20px_44px_-26px_rgba(34,81,56,0.45)] backdrop-blur-xl transition-colors duration-500 sm:px-6 lg:px-8",
              navIsDark
                ? "border-white/15 bg-transparent text-white"
                : "border-hairline/70 bg-transparent text-forest-dark",
            )}
          >
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

              <span
                className={cn(
                  "font-display text-2xl font-medium tracking-tight transition-colors duration-500",
                  navIsDark ? "text-white" : "text-forest-dark",
                )}
              >
                <span className="font-display text-2xl font-medium text-primary-foreground-strong">
                  Re
                </span>
                <span className="font-display text-2xl font-light italic text-primary-foreground-strong">
                  Bites
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-7 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.label} className="relative">
                  <Link
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.label, link.href)}
                    aria-current={activeNav === link.label ? "page" : undefined}
                    className={cn(
                      "relative py-1 font-inter text-sm transition-colors duration-300",
                      activeNav === link.label
                        ? navIsDark
                          ? "font-semibold text-white"
                          : "font-semibold text-forest-dark"
                        : navIsDark
                          ? "text-white/80 hover:text-white"
                          : "text-forest-dark/80 hover:text-caramel",
                    )}
                  >
                    {link.label}

                    {activeNav === link.label && (
                      <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-caramel" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className={cn(
                  "hidden items-center gap-1.5 rounded-full px-5 py-2.5 font-inter text-sm font-semibold shadow-[0_14px_30px_-18px_rgba(34,81,56,0.65)] transition-colors duration-300 sm:flex",
                  navIsDark
                    ? "bg-white text-forest-dark hover:bg-[#C8A882] hover:text-white"
                    : "bg-forest text-white hover:bg-[#C8A882] hover:text-white",
                  FOCUS_RING,
                )}
              >
                <User className="h-3.5 w-3.5" />
                {t("Masuk", "Log In")}
              </Link>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? "Tutup menu" : "Buka menu"}
                aria-expanded={open}
                className={cn(
                  "flex h-10 w-10 items-center justify-center lg:hidden",
                  navIsDark ? "text-white" : "text-forest",
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

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-2 overflow-hidden rounded-3xl border border-hairline/70 bg-white p-3 shadow-[0_28px_56px_-28px_rgba(34,81,56,0.5)] lg:hidden"
              >
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={(e) =>
                          scrollToSection(e, link.label, link.href)
                        }
                        className={cn(
                          "flex items-center justify-between rounded-2xl px-4 py-3 font-inter text-sm transition-colors duration-300",
                          activeNav === link.label
                            ? "bg-caramel/10 font-semibold text-forest-dark"
                            : "text-forest-dark hover:bg-cream",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex border-t border-hairline/70 pt-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-forest py-3 font-inter text-sm font-semibold text-white transition-colors duration-300 hover:bg-caramel"
                  >
                    <User className="h-3.5 w-3.5" />
                    {t("Masuk", "Log In")}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <section
        id="top"
        className="relative flex min-h-[100svh] flex-col items-center bg-cream px-5 pb-32 pt-24 sm:px-8 lg:px-12 lg:pb-40 lg:pt-28"
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 760"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="hero-organic-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#225138" stopOpacity="0.18" />

              <stop offset="55%" stopColor="#225138" stopOpacity="0.10" />

              <stop offset="100%" stopColor="#225138" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="
              M -80 150
              C 180 90, 360 100, 510 185
              C 650 265, 760 320, 930 285
              C 1040 262, 1130 215, 1260 110
            "
            fill="none"
            stroke="url(#hero-organic-line)"
            strokeWidth="2"
          />

          <path
            d="
              M -80 190
              C 190 130, 370 145, 520 220
              C 670 300, 790 350, 940 318
              C 1060 292, 1150 235, 1260 150
            "
            fill="none"
            stroke="url(#hero-organic-line)"
            strokeWidth="1"
          />
        </svg>

        <div className="relative mx-auto max-w-[1200px]">
          <HeroOrganicArt />

          <div className="hero-text relative z-20 max-w-[560px] lg:ml-[calc(-50vw+50%+7rem)]">
            <h1 className="font-display text-[clamp(2.8rem,5vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              <span className="text-forest-dark">
                <span className="text-caramel">Selamatkan</span> Makanan,
              </span>

              <span className="block text-forest">
                <span className="text-caramel">Selamatkan</span> Bumi.
              </span>
            </h1>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/#cara-kerja"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-7 py-3.5 font-inter text-sm font-semibold text-forest-dark shadow-[0_14px_30px_-20px_rgba(34,81,56,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:border-caramel/50 hover:text-caramel",
                  FOCUS_RING,
                )}
              >
                Lihat Cara Kerja
              </Link>

              <Link
                href="/#cta"
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r bg-forest px-7 py-3.5 font-inter text-sm font-semibold text-white shadow-[0_16px_32px_-16px_rgba(34,81,56,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-caramel",
                  FOCUS_RING,
                )}
              >
                Mulai Selamatkan Makanan
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Mobile carousel – stays in flow below text */}
          <div className="relative z-10 mx-auto mt-12 w-full max-w-[360px] lg:hidden">
            <div className="relative h-[480px] w-full sm:h-[540px]">
              <OptionWheel
                items={FOODS.map((f) => f.name)}
                defaultSelected={0}
                side="right"
                fontSize={8}
                spacing={1.4}
                curve={20}
                tilt={6}
                blur={3}
                fade={0.32}
                minOpacity={0.02}
                smoothing={160}
                loop
                draggable
                autoRotate
                autoRotateInterval={1500}
                plateSize={315}
                onChange={(index) => setFoodIndex(index)}
                renderItem={(i) => <FoodPlate image={FOODS[i].image} />}
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-cream to-transparent sm:h-24"
              />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-cream to-transparent sm:h-24"
              />
            </div>
          </div>
        </div>

        {/*
          Desktop carousel – absolutely positioned within the section (full-width)
          so its right offset is relative to the viewport, not the 1200px container.
          overflow-hidden lives here only, keeping the hero section itself unclipped.
        */}
        <div className="pointer-events-none absolute right-[clamp(8px,2vw,50px)] top-1/2 z-10 hidden -translate-y-1/2 lg:block">
          <div
            className="pointer-events-auto relative overflow-hidden rounded-[28px]"
            style={{
              width: "clamp(460px, 36vw, 540px)",
              height: "clamp(460px, 36vw, 540px)",
            }}
          >
            <OptionWheel
              items={FOODS.map((f) => f.name)}
              defaultSelected={0}
              side="right"
              fontSize={8}
              spacing={1.4}
              curve={20}
              tilt={6}
              blur={3}
              fade={0.32}
              minOpacity={0.02}
              smoothing={160}
              loop
              draggable
              autoRotate
              autoRotateInterval={1500}
              plateSize={400}
              onChange={(index) => setFoodIndex(index)}
              renderItem={(i) => <FoodPlate image={FOODS[i].image} />}
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-cream to-transparent sm:h-24 lg:h-28"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-cream to-transparent sm:h-24 lg:h-28"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroOrganicArt() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 560"
      preserveAspectRatio="none"
      className="
        pointer-events-none
        absolute
        left-1/2
        top-[90px]
        z-0
        h-[470px]
        w-screen
        -translate-x-1/2
        overflow-visible
        text-forest
      "
    >
      <g
        fill="none"
        stroke="#225138"
        strokeOpacity="0.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="
            M -220 330
            C -40 220, 120 175, 300 215
            C 465 252, 545 350, 700 330
            C 850 310, 925 190, 1080 175
            C 1245 160, 1370 220, 1660 70
          "
          strokeWidth="2.8"
          opacity="0.72"
        />

        <path
          d="
            M -220 365
            C -35 255, 125 215, 305 248
            C 470 280, 560 375, 710 355
            C 855 335, 935 220, 1090 205
            C 1250 188, 1380 245, 1660 105
          "
          strokeWidth="1.7"
          opacity="0.52"
        />

        <path
          d="
            M -220 393
            C -30 290, 140 252, 315 278
            C 485 305, 570 397, 720 380
            C 870 363, 950 250, 1100 235
            C 1265 218, 1395 265, 1660 135
          "
          strokeWidth="1"
          opacity="0.34"
        />

        <path
          d="
            M 115 260
            C 77 220, 30 225, 12 267
            C 51 297, 94 292, 115 260Z
          "
          strokeWidth="2"
          opacity="0.62"
        />

        <path
          d="
            M 19 268
            C 48 266, 81 262, 112 260
          "
          strokeWidth="1.3"
          opacity="0.48"
        />

        <path
          d="
            M 175 243
            C 184 195, 225 171, 260 196
            C 258 239, 222 266, 175 243Z
          "
          strokeWidth="1.9"
          opacity="0.56"
        />

        <path
          d="
            M 180 241
            C 207 228, 234 211, 257 198
          "
          strokeWidth="1.2"
          opacity="0.42"
        />

        <path
          d="
            M 325 210
            C 289 178, 298 142, 336 133
            C 362 162, 351 197, 325 210Z
          "
          strokeWidth="1.8"
          opacity="0.50"
        />

        <path
          d="
            M 327 206
            C 333 180, 336 154, 336 135
          "
          strokeWidth="1"
          opacity="0.38"
        />

        <ellipse
          cx="590"
          cy="330"
          rx="88"
          ry="43"
          strokeWidth="2"
          opacity="0.56"
        />

        <ellipse
          cx="590"
          cy="330"
          rx="62"
          ry="27"
          strokeWidth="1.2"
          opacity="0.40"
        />

        <path
          d="
            M 535 330
            C 551 304, 580 302, 595 321
            C 611 299, 640 305, 655 330
          "
          strokeWidth="1.7"
          opacity="0.50"
        />

        <path
          d="
            M 540 334
            C 548 359, 570 370, 590 368
            C 614 371, 638 358, 647 334
          "
          strokeWidth="1.3"
          opacity="0.40"
        />

        <path
          d="
            M 580 317
            C 565 294, 575 274, 598 270
            C 616 288, 609 310, 580 317Z
          "
          strokeWidth="1.4"
          opacity="0.44"
        />

        <path
          d="
            M 582 314
            C 588 297, 593 282, 597 271
          "
          strokeWidth="1"
          opacity="0.32"
        />

        <path
          d="
            M 760 352
            C 726 321, 690 334, 694 371
            C 700 410, 731 434, 760 443
            C 790 432, 820 410, 826 371
            C 831 334, 796 321, 760 352Z
          "
          strokeWidth="1.8"
          opacity="0.48"
        />

        <path
          d="
            M 760 351
            C 766 334, 783 324, 799 328
          "
          strokeWidth="1.2"
          opacity="0.38"
        />

        <path
          d="
            M 880 220
            C 864 180, 884 150, 920 150
            C 942 181, 925 216, 880 220Z
          "
          strokeWidth="1.8"
          opacity="0.46"
        />

        <path
          d="
            M 884 216
            C 895 193, 909 169, 919 152
          "
          strokeWidth="1"
          opacity="0.34"
        />

        <path
          d="
            M 1015 320
            C 992 290, 996 258, 1020 236
          "
          strokeWidth="2"
          opacity="0.48"
        />

        <path d="M 1020 236 L 1007 238" strokeWidth="1.4" opacity="0.42" />

        <path d="M 1020 236 L 1018 249" strokeWidth="1.4" opacity="0.42" />

        <path
          d="
            M 1020 236
            C 1049 234, 1072 249, 1083 270
          "
          strokeWidth="2"
          opacity="0.48"
        />

        <path d="M 1083 270 L 1085 256" strokeWidth="1.4" opacity="0.42" />

        <path d="M 1083 270 L 1069 268" strokeWidth="1.4" opacity="0.42" />

        <path
          d="
            M 1083 270
            C 1077 301, 1052 320, 1021 321
          "
          strokeWidth="2"
          opacity="0.48"
        />

        <path d="M 1021 321 L 1033 315" strokeWidth="1.4" opacity="0.42" />

        <path d="M 1021 321 L 1024 308" strokeWidth="1.4" opacity="0.42" />

        <path d="M 1180 150 L 1180 320" strokeWidth="1.8" opacity="0.34" />

        <path d="M 1170 150 L 1170 214" strokeWidth="1.2" opacity="0.30" />

        <path d="M 1180 150 L 1180 214" strokeWidth="1.2" opacity="0.30" />

        <path d="M 1190 150 L 1190 214" strokeWidth="1.2" opacity="0.30" />

        <path
          d="
            M 1170 215
            C 1170 230, 1175 237, 1180 240
            C 1185 237, 1190 230, 1190 215
          "
          strokeWidth="1.2"
          opacity="0.30"
        />

        <circle
          cx="255"
          cy="310"
          r="4"
          fill="#225138"
          stroke="none"
          opacity="0.46"
        />

        <circle
          cx="355"
          cy="350"
          r="2.5"
          fill="#225138"
          stroke="none"
          opacity="0.36"
        />

        <circle
          cx="665"
          cy="250"
          r="4"
          fill="#225138"
          stroke="none"
          opacity="0.42"
        />

        <circle
          cx="830"
          cy="300"
          r="2.5"
          fill="#225138"
          stroke="none"
          opacity="0.34"
        />

        <circle
          cx="1120"
          cy="340"
          r="4"
          fill="#225138"
          stroke="none"
          opacity="0.40"
        />

        <path d="M 430 150 V 170" strokeWidth="1.5" opacity="0.38" />

        <path d="M 420 160 H 440" strokeWidth="1.5" opacity="0.38" />

        <path d="M 930 365 V 383" strokeWidth="1.3" opacity="0.34" />

        <path d="M 921 374 H 939" strokeWidth="1.3" opacity="0.34" />
      </g>
    </svg>
  );
}

function FoodPlate({ image }: { image: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `plate-surface-${uid}`;
  const clipId = `plate-cut-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Piring makanan"
      className="h-full w-full drop-shadow-[0_16px_22px_-14px_rgba(34,81,56,0.55)]"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="42%">
          <stop offset="0%" stopColor="#F7F6EE" />
          <stop offset="72%" stopColor="#E9E7D9" />
          <stop offset="100%" stopColor="#D5D2C1" />
        </radialGradient>

        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="84" />
        </clipPath>
      </defs>

      <circle cx="100" cy="100" r="92" fill={`url(#${gradId})`} />

      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="#C8C5B5"
        strokeWidth="2.5"
      />

      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#D8D5C6"
        strokeWidth="1.5"
      />

      <circle cx="100" cy="100" r="86" fill="#F5F3E9" />

      <image
        href={image}
        x="0"
        y="0"
        width="200"
        height="200"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />

      <circle
        cx="100"
        cy="100"
        r="84"
        fill="none"
        stroke="#F5F3E9"
        strokeWidth="4"
      />

      <ellipse cx="80" cy="66" rx="46" ry="22" fill="#FFFFFF" opacity="0.16" />
    </svg>
  );
}
