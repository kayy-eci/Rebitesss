"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export type Step = {
  title: string;
  description: string;
  image: string;
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
      className={`relative flex min-h-[260px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 shadow-sm transition-[box-shadow,background-color] duration-500 ${
        isActive ? "bg-white shadow-md" : "bg-[#F8FAFC]"
      }`}
      onMouseEnter={isTouch ? undefined : onHoverStart}
      onMouseLeave={isTouch ? undefined : onHoverEnd}
      onClick={isTouch ? onSelect : undefined}
    >
      <div className="relative h-[140px] w-full shrink-0 overflow-hidden">
        <Image
          src={step.image}
          alt={step.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col px-6 pb-6 pt-4">
        <h3 className="font-display text-xl font-medium leading-snug text-[#111827]">
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
