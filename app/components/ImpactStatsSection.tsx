'use client';

import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { impactStats } from '@/lib/data';
import { Counter } from '@/app/components/counter';
import { DotPattern, FloatingLeaf, SoftBlob } from '@/app/components/Ornaments';

export function ImpactStatsSection() {
  return (
    <section
      id="dampak"
      className="grain-overlay relative scroll-mt-24 overflow-hidden bg-forest-900"
    >
      <SoftBlob className="-left-24 top-1/4 h-80 w-80 bg-white/5" />
      <SoftBlob className="-right-28 bottom-10 h-96 w-96 bg-green-700/20" />
      <DotPattern className="right-12 top-12 hidden h-24 w-24 text-white/10 lg:block" />
      <FloatingLeaf className="left-10 top-10 hidden h-6 w-6 text-gold-500/60 lg:block" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cream-50">
            <Leaf className="h-3.5 w-3.5 text-gold-500" />
            Dampak Lingkungan
          </span>
          <h2 className="mt-5 font-sans text-3xl font-bold tracking-tight text-cream-50 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Setiap porsi yang terselamatkan
            <br className="hidden sm:block" /> adalah langkah menuju Indonesia
            tanpa food waste.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {impactStats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="rounded-2xl border border-white/10 bg-forest-800 p-6 text-center sm:text-left"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-cream-50">
                <stat.icon className="h-6 w-6 text-gold-500" strokeWidth={1.6} />
              </span>
              <p className="mt-5 font-sans text-4xl font-bold tracking-tight text-cream-50">
                <Counter to={stat.value} suffix={stat.suffix} duration={1.8} />
              </p>
              <p className="mt-2 font-inter text-sm leading-relaxed text-cream-50/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
