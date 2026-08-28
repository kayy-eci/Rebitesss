"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Store } from "lucide-react";
import { SellerShell } from "@/app/components/dashboardPenjual/SellerShell";
import { Card } from "@/app/components/dashboardPenjual/Card";
import {
  getSellerStoreSettings,
  setStoreOpenHours,
  updateStoreSettings,
} from "@/lib/store-settings-storage";
import { supabase } from "@/lib/supabase";

function inputClass() {
  return "w-full rounded-xl border border-sage-100 bg-white px-3 py-1.5 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-500/50 focus:border-primary";
}

export default function PengaturanTokoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [openHours, setOpenHours] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const settings = await getSellerStoreSettings();
      if (cancelled) return;
      setStoreName(settings?.storeName ?? "");
      setDescription(settings?.description ?? "");
      setAddress(settings?.address ?? "");
      setImageUrl(settings?.image ?? "");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 2MB.");
      return;
    }
    setError("");
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setMessage("");
    setError("");

    if (!storeName.trim()) {
      setError("Nama toko wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      let finalImage = imageUrl;
      if (logoFile) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const uid = session?.user.id;
        if (!uid) throw new Error("Sesi berakhir. Silakan masuk kembali.");

        const ext = logoFile.name.split(".").pop() ?? "png";
        const path = `logos/${uid}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("umkm-logos")
          .upload(path, logoFile, { upsert: true });
        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("umkm-logos").getPublicUrl(path);
          finalImage = publicUrl;
        }
      }

      const ok = await updateStoreSettings({
        storeName: storeName.trim(),
        description: description.trim(),
        address: address.trim(),
        image: finalImage || undefined,
      });
      if (!ok) throw new Error("Gagal menyimpan pengaturan toko.");

      if (openHours.trim()) {
        await setStoreOpenHours(openHours.trim());
      }

      setLogoFile(null);
      setLogoPreview(null);
      setMessage("Pengaturan toko tersimpan. Perubahan langsung tampil di halaman Detail Toko.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SellerShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sage-500">
          Pengaturan
        </p>
        <h1 className="mt-0.5 font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-tight tracking-[-0.02em] text-primary">
          Pengaturan Toko
        </h1>
        <p className="mt-0.5 text-xs text-sage-500">
          Identitas toko ini ditampilkan di marketplace dan halaman Detail Toko.
        </p>

        <Card className="mt-4">
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-11 animate-pulse rounded-xl bg-cream-100" />
              ))}
            </div>
          ) : (
            <form
              className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                void handleSave();
              }}
              noValidate
            >
              <div>
                <label
                  htmlFor="settings-store-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-sage-500"
                >
                  Nama Toko
                </label>
                <input
                  id="settings-store-name"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Nama usaha kamu"
                  className={inputClass()}
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="settings-description"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-sage-500"
                >
                  Deskripsi Toko
                </label>
                <textarea
                  id="settings-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan tentang usaha kamu..."
                  className={`${inputClass()} resize-none`}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-address"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-sage-500"
                >
                  Alamat Toko
                </label>
                <input
                  id="settings-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. contoh no. 123"
                  className={inputClass()}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-open-hours"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-sage-500"
                >
                  Jam Operasional
                </label>
                <input
                  id="settings-open-hours"
                  type="text"
                  value={openHours}
                  onChange={(e) => setOpenHours(e.target.value)}
                  placeholder="09.00–21.00"
                  className={inputClass()}
                />
              </div>

              <div>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-sage-500">
                  Logo / Foto Toko
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-sage-100 bg-cream-50">
                    {logoPreview || imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoPreview ?? imageUrl}
                        alt="Logo toko"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-sage-500/40" />
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="rounded-md border border-sage-100 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-primary transition-colors hover:bg-sage-100/40"
                    >
                      {logoFile ? "Ganti Logo" : "Pilih Logo"}
                    </button>
                    <p className="mt-0.5 text-[10px] text-charcoal-500/60">
                      PNG/JPG, maks 2MB
                    </p>
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="text-[12px] text-red-600 lg:col-span-2">
                  {error}
                </p>
              )}
              {message && (
                <p role="status" className="flex items-center gap-1.5 text-[12px] text-primary lg:col-span-2">
                  <Store className="h-3.5 w-3.5" />
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-caramel-800 disabled:cursor-not-allowed disabled:opacity-70 lg:col-span-2"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          )}
        </Card>
      </div>
    </SellerShell>
  );
}
