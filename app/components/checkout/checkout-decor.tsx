'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf } from 'lucide-react';
import {
  ArcLines,
  DotPattern,
  FloatingLeaf,
  LeafSprig,
  SoftBlob,
} from '@/app/components/Ornaments';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function CheckoutDecor() {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 70]);
  const y2 = useTransform(scrollY, [0, 800], [0, -50]);
  const y3 = useTransform(scrollY, [0, 800], [0, 40]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        style={reduced ? {} : { y: y1 }}
        className="absolute -right-32 -top-20"
      >
        <SoftBlob className="static h-72 w-72 bg-green-700/[0.07] sm:h-96 sm:w-96" />
      </motion.div>

      <motion.div
        style={reduced ? {} : { y: y2 }}
        className="absolute -left-24 top-1/3"
      >
        <SoftBlob className="static h-80 w-80 bg-sage-500/[0.08]" />
      </motion.div>

      <motion.div
        style={reduced ? {} : { y: y3 }}
        className="absolute -bottom-24 right-10"
      >
        <SoftBlob className="static h-72 w-72 bg-green-700/[0.06]" />
      </motion.div>

      <LeafSprig className="-right-10 top-40 hidden h-44 w-44 rotate-[150deg] text-green-700/10 lg:block" />
      <LeafSprig className="-left-12 bottom-16 hidden h-40 w-40 -rotate-12 text-green-700/10 md:block" />

      <DotPattern className="right-14 top-1/2 hidden h-20 w-20 text-green-700/10 lg:block" />
      <DotPattern className="left-16 top-24 hidden h-16 w-16 text-green-700/10 md:block" />

      <ArcLines className="-bottom-6 left-1/2 hidden h-[220px] w-[760px] -translate-x-1/2 text-green-700/[0.06] lg:block" />

      {reduced ? (
        <>
          <Leaf
            className="absolute left-[12%] top-32 h-5 w-5 rotate-12 text-green-700/30"
            strokeWidth={1.5}
          />
          <Leaf
            className="absolute right-[16%] bottom-40 hidden h-5 w-5 -rotate-45 text-green-700/25 md:block"
            strokeWidth={1.5}
          />
        </>
      ) : (
        <>
          <FloatingLeaf
            className="left-[12%] top-32 h-5 w-5 text-green-700/35"
            delay={0.8}
          />
          <FloatingLeaf
            className="right-[16%] bottom-40 hidden h-5 w-5 text-green-700/30 md:block"
            delay={2.4}
          />
        </>
      )}
    </div>
  );
}
