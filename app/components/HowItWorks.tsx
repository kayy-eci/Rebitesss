"use client";

import { useEffect, useState } from "react";
import { Compass, HeartHandshake, Recycle, ShieldCheck } from "lucide-react";
import { Reveal } from "@/app/components/reveal";
import ReBitesStepCard, { type Step } from "@/app/components/ReBitesStepCard";

const steps: Step[] = [
  {
    number: "01",
    title: "UMKM Mendaftar & Mengunggah Produk",
    description:
      "Pelaku UMKM mengunggah makanan surplus yang masih layak konsumsi beserta informasi harga, stok, dan waktu penjualan.",
    image:
      "https://images.pexels.com/photos/5874513/pexels-photo-5874513.jpeg",
    icon: Compass,
  },
  {
    number: "02",
    title: "Pembeli Mencari & Memesan",
    description:
      "Pembeli mencari makanan surplus sesuai kebutuhan, kemudian memilih dan memesan makanan yang diinginkan.",
    image:
      "https://images.pexels.com/photos/7213361/pexels-photo-7213361.jpeg",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Pilih Metode Penerimaan",
    description:
      "Pembeli memilih metode penerimaan makanan, yaitu diantar atau diambil langsung.",
    image:
      "https://images.pexels.com/photos/12725452/pexels-photo-12725452.jpeg",
    icon: HeartHandshake,
  },
  {
    number: "04",
    title: "Makanan Terselamatkan!",
    description:
      "Setiap pesanan membantu menyelamatkan makanan surplus agar tidak berakhir sebagai food waste.",
    image:
      "https://images.pexels.com/photos/37052500/pexels-photo-37052500.jpeg",
    icon: Recycle,
  },
];

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  return (
    <section id="cara-kerja" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal delay={0}>
          <div className="flex justify-center">
            <span className="inline-flex items-center rounded-full border border-[#005A46]/20 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#005A46]">
              Cara Kerja
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-6 text-center font-display text-[clamp(2rem,4vw,3.375rem)] font-semibold leading-[1.1] tracking-[-0.01em] text-[#112D4E]">
            Cara Kerja ReBites
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-[700px] text-center font-sans text-base font-normal leading-relaxed text-[#475569] lg:text-lg">
            ReBites menghubungkan makanan berlebih dengan orang dan lingkungan
            yang membutuhkan melalui proses yang sederhana, aman, dan berdampak.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-12">
            {steps.map((step, index) => (
              <ReBitesStepCard
                key={step.number}
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
        </Reveal>
      </div>
    </section>
  );
}
