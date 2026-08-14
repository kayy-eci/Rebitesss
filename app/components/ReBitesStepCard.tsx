"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

export type Step = {
  number: string;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
};

type ReBitesStepCardProps = {
  step: Step;
  isActive: boolean;
  isTouch: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
};

export default function ReBitesStepCard({
  step,
  isActive,
  isTouch,
  onHoverStart,
  onHoverEnd,
  onSelect,
}: ReBitesStepCardProps) {
  return (
    <div
      className={`relative flex h-[400px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 shadow-sm transition-[box-shadow,background-color] duration-500 ${
        isActive ? "bg-white shadow-md" : "bg-[#F8FAFC]"
      }`}
      onMouseEnter={isTouch ? undefined : onHoverStart}
      onMouseLeave={isTouch ? undefined : onHoverEnd}
      onClick={isTouch ? onSelect : undefined}
    >
      <motion.span
        aria-hidden
        animate={{ opacity: isActive ? 0 : 1, y: isActive ? -12 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="absolute left-5 top-4 z-20 select-none font-sans text-5xl font-semibold leading-none text-[#CBD5E1]"
      >
        {step.number}
      </motion.span>

      <motion.div
        aria-hidden
        animate={{ height: isActive ? 140 : 0, opacity: isActive ? 1 : 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 32,
          mass: 0.9,
        }}
        className="relative w-full shrink-0 overflow-hidden"
      >
        <div className="relative h-[140px] w-full">
          <Image
            src={step.image}
            alt={step.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      <div className="mt-auto flex flex-col px-6 pb-6 pt-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/5 bg-white text-caramel">
          <step.icon className="h-5 w-5" strokeWidth={2} />
        </span>

        <h3 className="mt-4 font-sans text-xl font-semibold leading-snug text-[#111827]">
          {step.title}
        </h3>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: 12,
                transition: { duration: 0.18, ease: "easeIn" },
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 26,
                delay: 0.08,
              }}
              className="mt-3 font-sans text-sm leading-relaxed text-[#475569]"
            >
              {step.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
