"use client";

import { Reveal } from "@/app/components/shared/reveal";
import ReBitesStepCard, { type Step } from "@/app/components/landing/ReBitesStepCard";

const steps: Step[] = [
  {
    title: "UMKM Mendaftar & Mengunggah",
    description:
      "Pemilik usaha mendaftarkan toko mereka dan mengunggah makanan yang berlebih dengan harga diskon.",
    image: "/penjual-login.jpg",
  },
  {
    title: "Pembeli Mencari & Memesan",
    description:
      "Pengguna aplikasi mencari makanan lezat di sekitar mereka dan memesannya langsung melalui aplikasi.",
    image: "/pembeli-mencaro.jpg",
  },
  {
    title: "Pilih Metode Penerimaan Pesanan",
    description:
      "Pilih untuk mengambil sendiri pesanan di toko atau gunakan layanan pengiriman yang tersedia.",
    image: "/penerimaan.jpg",
  },
  {
    title: "Makanan Berhasil Diselamatkan!",
    description:
      "Nikmati makanan lezat Anda dengan harga hemat, sekaligus berkontribusi menyelamatkan lingkungan.",
    image: "/terselamatkan.jpg",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="cara-kerja"
      data-nav="green"
      className="flex min-h-[640px] flex-col justify-center overflow-hidden bg-primary py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal delay={0.05}>
          <h2 className="text-center font-display text-[clamp(2rem,4vw,3.375rem)] font-medium leading-[1.1] tracking-[-0.01em] text-primary-foreground">
            Cara Kerja ReBites
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-3 max-w-[560px] text-center font-sans text-sm font-normal leading-relaxed text-primary-foreground/70 lg:text-base">
            Langkah mudah untuk menyelamatkan makanan enak dan membantu UMKM
            mengurangi sampah makanan.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 lg:mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <ReBitesStepCard key={step.title} step={step} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
