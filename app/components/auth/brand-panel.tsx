"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, Leaf, Sparkles } from "lucide-react";

const IMG_MAIN =
  "https://images.pexels.com/photos/16134564/pexels-photo-16134564.jpeg?auto=compress&cs=tinysrgb&w=900";
const IMG_BOWL =
  "https://images.pexels.com/photos/8964280/pexels-photo-8964280.jpeg?auto=compress&cs=tinysrgb&w=500";
const IMG_PASTA =
  "https://images.pexels.com/photos/546945/pexels-photo-546945.jpeg?auto=compress&cs=tinysrgb&w=500";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Float({
  children,
  className,
  duration = 6,
  delay = 0,
  distance = 12,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  distance?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1, y: [0, -distance, 0] }}
      transition={{
        opacity: { duration: 0.8, delay, ease: EASE },
        scale: { duration: 0.8, delay, ease: EASE },
        y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  );
}

function Twinkle({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.35, scale: 0.8 }}
      animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.12, 0.8] }}
      transition={{ duration: 4.5, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles className="h-full w-full" />
    </motion.div>
  );
}

function RotatingStamp({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: 360 }}
      transition={{
        opacity: { duration: 0.8, ease: EASE },
        scale: { duration: 0.8, ease: EASE },
        rotate: { duration: 28, repeat: Infinity, ease: "linear" },
      }}
    >
      <div className="relative h-full w-full">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <path
              id="authStamp"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />
          <text
            className="font-inter font-semibold uppercase"
            fontSize="8.2"
            letterSpacing="2.4"
            fill="rgba(255,255,255,0.9)"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            <textPath href="#authStamp" startOffset="0%">
              RESCUED • FRESH • DAILY •
            </textPath>
          </text>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <Leaf className="h-5 w-5 text-amber" />
        </span>
      </div>
    </motion.div>
  );
}

interface BrandPanelProps {
  title: ReactNode;
  description: string;
}

export default function BrandPanel({ title, description }: BrandPanelProps) {
  return (
    <section
      aria-hidden
      className="grain-overlay relative hidden min-h-screen overflow-hidden bg-[#1B3F2C] lg:block"
    >
      <div className="absolute inset-0">
        <img
          src={IMG_MAIN}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(34,81,56,0.88)_0%,rgba(34,81,56,0.55)_48%,rgba(18,45,32,0.94)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#122D20]/70 via-transparent to-[#1B3F2C]/45" />
      </div>

      <div className="pointer-events-none absolute -left-1/4 top-1/4 h-[34rem] w-[34rem] rounded-full bg-[#C89B5A]/25 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[38rem] w-[38rem] rounded-full bg-[#122D20]/85 blur-[110px]" />

      <div className="pointer-events-none absolute -right-24 top-14 h-[240px] w-[240px] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-16 top-24 h-[180px] w-[180px] rounded-full border border-white/10" />

      <Twinkle className="pointer-events-none absolute right-36 top-10 h-6 w-6 text-[#D6A54A]/70" />
      <Twinkle
        className="pointer-events-none absolute right-64 top-20 h-3.5 w-3.5 text-white/40"
        delay={1.6}
      />
      <motion.div
        className="pointer-events-none absolute right-24 top-40 text-white/10"
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf className="h-16 w-16" strokeWidth={1.25} />
      </motion.div>

      <div className="absolute left-8 top-8 z-10 flex items-center gap-2.5 text-[#F7F5EF] xl:left-12 xl:top-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm"
        >
          <Leaf className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="font-display text-lg font-medium tracking-tight"
        >
          ReBites
        </motion.span>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <RotatingStamp className="absolute right-14 top-24 h-20 w-20 drop-shadow-[0_16px_28px_rgba(18,45,32,0.5)] xl:right-24 xl:top-28 xl:h-24 xl:w-24" />

        <Float
          className="absolute right-[30%] top-[30%] xl:right-[32%]"
          duration={8}
          delay={0.5}
          distance={14}
        >
          <img
            src={IMG_BOWL}
            alt=""
            width={200}
            height={200}
            className="h-24 w-24 rounded-full border-4 border-white/25 object-cover shadow-[0_24px_48px_-24px_rgba(18,45,32,0.8)] xl:h-28 xl:w-28"
          />
        </Float>

        <Float
          className="absolute right-[16%] top-[48%] xl:right-[20%]"
          duration={9}
          delay={1}
          distance={10}
        >
          <img
            src={IMG_PASTA}
            alt=""
            width={160}
            height={160}
            className="h-20 w-20 rounded-full border-4 border-white/25 object-cover shadow-[0_24px_48px_-24px_rgba(18,45,32,0.8)] xl:h-24 xl:w-24"
          />
        </Float>

        <Float
          className="absolute right-[40%] top-[42%] xl:right-[42%]"
          duration={6}
          delay={1.2}
        >
          <div className="flex items-center gap-2 rounded-full bg-[#D6A54A]/90 px-4 py-2 text-[#1B3F2C] shadow-[0_12px_24px_-12px_rgba(18,45,32,0.7)]">
            <Leaf className="h-3.5 w-3.5" strokeWidth={2.2} />
            <span className="font-inter text-sm font-bold uppercase tracking-wide">
              Hemat 50%
            </span>
          </div>
        </Float>

        <Float
          className="absolute right-[22%] top-[58%] xl:right-[26%]"
          duration={9}
          delay={1.5}
          distance={11}
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-[0_24px_48px_-24px_rgba(18,45,32,0.7)] backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#225138]">
                <Check className="h-4 w-4 text-[#F7F5EF]" />
              </span>
              <div>
                <p className="font-display text-sm font-bold leading-tight text-white">
                  2,1 juta porsi
                </p>
                <p className="font-inter text-[11px] text-white/70">
                  makanan terselamatkan
                </p>
              </div>
            </div>
          </div>
        </Float>

        <Twinkle
          className="absolute right-[40%] top-[20%] h-5 w-5 text-[#D6A54A]/80"
          delay={2.2}
        />
        <Twinkle
          className="absolute right-[12%] top-[38%] h-4 w-4 text-white/50"
          delay={3}
        />
        <Twinkle
          className="absolute right-[36%] top-[66%] h-4 w-4 text-white/40"
          delay={1}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-14">
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="max-w-md font-display text-[clamp(2.4rem,3.2vw,2.75rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-[#F7F5EF] [text-shadow:0_2px_24px_rgba(18,45,32,0.65)]"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mt-5 max-w-[26rem] text-[0.95rem] leading-relaxed text-[#F7F5EF]/70"
        >
          {description}
        </motion.p>
      </div>
    </section>
  );
}
