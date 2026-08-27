import type { ReactNode } from "react";
import BrandPanel from "./brand-panel";

interface AuthShellProps {
  brand: {
    title: ReactNode;
    description: string;
  };
  children: ReactNode;
}

export default function AuthShell({ brand, children }: AuthShellProps) {
  return (
    <main className="relative h-screen bg-[#F7F5EF] lg:grid lg:grid-cols-2 overflow-hidden">
      <section className="relative order-2 flex h-full flex-col overflow-hidden bg-[#F7F5EF] px-6 sm:px-10 lg:order-2">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#AEB89B]/30 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#D6A54A]/15 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#DEDACF_1.5px,transparent_1.5px)] [background-size:26px_26px]" />
        <div className="pointer-events-none absolute right-8 top-16 h-4 w-4 rounded-full border border-[#AEB89B]/60" />
        <div className="pointer-events-none absolute right-16 top-24 h-2.5 w-2.5 rounded-full border border-[#AEB89B]/50" />
        <div className="pointer-events-none absolute bottom-16 left-8 h-3 w-3 rounded-full bg-[#D6A54A]/40" />

        <div className="relative z-10 w-full max-w-[380px]">{children}</div>
      </section>
      <BrandPanel title={brand.title} description={brand.description} />
    </main>
  );
}
