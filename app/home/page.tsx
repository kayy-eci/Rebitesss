"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  nama: string;
  email: string;
  role: string;
};

export default function HomePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("nama, email, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Gagal mengambil profile:", error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    getProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <h1>REBITES</h1>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => router.push("/profile")}>
              Profile
            </button>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "16px",
            marginBottom: "25px",
          }}
        >
          <p style={{ color: "#666" }}>Selamat datang 👋</p>

          <h2 style={{ marginTop: "8px" }}>
            Halo, {profile?.nama || "User"}!
          </h2>

          <p style={{ color: "#666" }}>
            Selamat datang di REBITES.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
            }}
          >
            <h3>🛍️ Belanja</h3>
            <p>Cari dan beli produk yang kamu inginkan.</p>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
            }}
          >
            <h3>🏪 Buat Toko</h3>
            <p>
              Punya produk sendiri? Buat toko di REBITES.
            </p>

            <button
              onClick={() => router.push("/buat-toko")}
              style={{
                marginTop: "10px",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              Buat Toko
            </button>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
            }}
          >
            <h3>📦 Pesanan</h3>
            <p>Lihat dan kelola pesanan kamu.</p>
          </div>
        </section>
      </div>
    </main>
  );
}