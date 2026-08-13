"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface OrbitCarouselProps<T> {
  items: T[];
  activeIndex: number;
  onChange?: (index: number, item: T) => void;
  renderItem: (index: number, item: T) => ReactNode;
  autoRotateInterval?: number;
  transition?: number;
  className?: string;
}

const wrapDeg = (a: number) => {
  a = a % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
};

function OrbitCarousel<T>({
  items,
  activeIndex,
  onChange,
  renderItem,
  autoRotateInterval = 5000,
  transition = 900,
  className,
}: OrbitCarouselProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const plateRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const plateSizeRef = useRef(160);
  const selRef = useRef(activeIndex);
  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [size, setSize] = useState({ w: 0, h: 0 });

  const n = items.length;
  const step = n > 0 ? 360 / n : 0;
  const initialPhase = n > 0 ? 90 - activeIndex * step - step / 2 : 0;
  const phase = useMotionValue(initialPhase);

  const computePlate = useCallback((w: number, h: number) => {
    return Math.min(
      Math.max(Math.round(Math.min(w * 0.15, h * 0.19)), 80),
      160,
    );
  }, []);

  const plateSize = size.w ? computePlate(size.w, size.h) : 160;
  const centerSize = plateSize * 1.4;

  const applyFrame = useCallback(() => {
    const { w, h } = sizeRef.current;
    if (!w || !h || n === 0) return;
    const pv = phase.get();
    const plate = plateSizeRef.current;
    const gapTarget = Math.round(plate * 0.12);
    const minR = (plate + gapTarget) / (2 * Math.sin(Math.PI / n));
    const maxFit = Math.min(
      w / 2 - plate / 2 - 16,
      h / 2 - plate / 2 - 28,
    );
    const R = Math.min(minR, maxFit);

    for (let i = 0; i < n; i++) {
      const el = plateRefs.current[i];
      if (!el) continue;
      const theta = i * step + pv;
      const rad = (theta * Math.PI) / 180;
      const x = R * Math.cos(rad);
      const y = R * Math.sin(rad);
      const d = Math.abs(wrapDeg(theta - 90));
      const focus = Math.max(0, 1 - d / 120);
      const scale = 0.6 + 0.4 * focus;
      const opacity = 0.7 + 0.28 * focus;
      const rot = Math.sin(rad) * (1 - focus) * 8;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(1 + Math.round(focus * 8));
    }
  }, [n, step, phase]);

  useMotionValueEvent(phase, "change", applyFrame);

  useEffect(() => {
    applyFrame();
  }, [size, applyFrame]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      sizeRef.current = { w, h };
      plateSizeRef.current = computePlate(w, h);
      setSize(sizeRef.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [computePlate]);

  const selectRef = useRef<(i: number) => void>(() => {});

  const schedule = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pausedRef.current || n <= 1) return;
    timerRef.current = setTimeout(() => {
      if (pausedRef.current) {
        schedule();
        return;
      }
      selectRef.current((selRef.current + 1) % n);
    }, autoRotateInterval);
  }, [n, autoRotateInterval]);

  const select = useCallback(
    (i: number) => {
      if (n <= 1 || i === selRef.current) return;
      let delta = i - selRef.current;
      if (delta > n / 2) delta -= n;
      if (delta < -n / 2) delta += n;
      selRef.current = i;
      const target = phase.get() - delta * step;
      animate(phase, target, {
        duration: transition / 1000,
        ease: [0.22, 1, 0.36, 1],
      });
      onChangeRef.current?.(i, items[i]);
      schedule();
    },
    [n, step, phase, transition, items, schedule],
  );

  selectRef.current = select;

  useEffect(() => {
    selRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [schedule]);

  useEffect(() => {
    plateRefs.current = plateRefs.current.slice(0, n);
    applyFrame();
  }, [n, applyFrame]);

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        schedule();
      }}
      className={cn("relative w-full select-none overflow-hidden", className)}
    >
      {items.map((item, i) => (
        <div
          key={i}
          ref={(el) => {
            plateRefs.current[i] = el;
          }}
          className="absolute left-1/2 top-1/2 will-change-transform"
          style={{
            width: plateSize,
            height: plateSize,
            marginLeft: -plateSize / 2,
            marginTop: -plateSize / 2,
            opacity: 0,
          }}
        >
          <button
            type="button"
            onClick={() => select(i)}
            className="block h-full w-full cursor-pointer rounded-full transition-transform duration-300 hover:scale-[1.06] focus:outline-none"
            aria-label={`Pilih ${i + 1}`}
          >
            {renderItem(i, item)}
          </button>
        </div>
      ))}

      <div
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{
          width: centerSize,
          height: centerSize,
          marginLeft: -centerSize / 2,
          marginTop: -centerSize / 2,
          zIndex: 50,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            className="h-full w-full"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 130, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderItem(activeIndex, items[activeIndex])}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OrbitCarousel;
