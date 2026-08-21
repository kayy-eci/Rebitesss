"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/app/components/reveal";
import ReBitesStepCard, { type Step } from "@/app/components/ReBitesStepCard";

const steps: Step[] = [
  {
    title: "UMKM Mendaftar & Mengunggah",
    description:
      "Pelaku UMKM mengunggah makanan surplus yang masih layak konsumsi beserta informasi harga, stok, dan waktu penjualan.",
    image: "/penjual-login.jpg",
  },
  {
    title: "Pembeli Mencari & Memesan",
    description:
      "Pembeli mencari makanan surplus sesuai kebutuhan, kemudian memilih dan memesan makanan yang diinginkan.",
    image: "/pembeli-mencaro.jpg",
  },
  {
    title: "Pilih Metode Penerimaan",
    description:
      "Pembeli memilih metode penerimaan makanan, yaitu diantar atau diambil langsung.",
    image: "/penerimaan.jpg",
  },
  {
    title: "Makanan Terselamatkan!",
    description:
      "Setiap pesanan membantu menyelamatkan makanan surplus agar tidak berakhir sebagai food waste.",
    image: "/terselamatkan.jpg",
  },
];

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  return (
    <section
      id="cara-kerja"
      data-nav="cream"
      className="bg-cream py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal delay={0.05}>
          <h2 className="mt-6 text-center font-display text-[clamp(2rem,4vw,3.375rem)] font-medium leading-[1.1] tracking-[-0.01em] text-primary">
            Cara Kerja ReBites
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-[700px] text-center font-sans text-base font-normal leading-relaxed text-primary/70 lg:text-lg">
            ReBites membantu makanan berlebih menemukan tempat yang tepat, agar
            tidak berakhir menjadi sampah.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative mt-14 lg:mt-16">
            <span
              aria-hidden
              className="absolute inset-x-12 top-[70px] hidden h-px bg-primary/15 lg:block"
            />

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
              {steps.map((step, index) => (
                <ReBitesStepCard
                  key={index}
                  step={step}
                  isActive={hoveredStep === index}
                  isTouch={isTouch}
                  onHoverStart={() => setHoveredStep(index)}
                  onHoverEnd={() => setHoveredStep(null)}
                  onSelect={() =>
                    setHoveredStep(hoveredStep === index ? null : index)
                  }
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
