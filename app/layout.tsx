import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/components/auth-provider";
import { Toaster } from "@/app/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://rebitesss.netlify.app"),
  title: "ReBites - Selamatkan Makanan Surplus, Kurangi Food Waste",
  description:
    "Marketplace yang mempertemukan pelaku UMKM kuliner dengan pembeli untuk menyelamatkan makanan surplus yang masih layak konsumsi. Dari dapur UMKM, ke piring yang butuh.",
  openGraph: {
    title: "ReBites - Selamatkan Makanan Surplus",
    description:
      "Marketplace makanan surplus untuk UMKM kuliner. Kurangi food waste, hemat pengeluaran.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
