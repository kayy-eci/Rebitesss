"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Store,
  MapPin,
  Tag,
  ImageIcon,
  User,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const KOTA_JABODETABEK = [
  "Jakarta Selatan",
  "Jakarta Barat",
  "Jakarta Utara",
  "Jakarta Pusat",
  "Jakarta Timur",
  "Kota Bogor",
  "Kabupaten Bogor",
  "Kota Depok",
  "Kota Tangerang",
  "Kabupaten Tangerang",
  "Kota Bekasi",
  "Kabupaten Bekasi",
  "Kepulauan Seribu",
] as const;

const KATEGORI_KULINER = [
  "Makanan",
  "Minuman",
  "Kue & Roti",
  "Bahan Baku",
  "Lainnya",
] as const;

const step1Schema = z
  .object({
    fullName: z.string().min(1, "Nama lengkap wajib diisi."),
    email: z.string().email("Email tidak valid."),
    password: z.string().min(6, "Kata sandi minimal 6 karakter."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Kata sandi tidak cocok.",
    path: ["confirmPassword"],
  });

const step2Schema = z.object({
  businessName: z.string().min(1, "Nama usaha wajib diisi."),
  category: z.string().min(1, "Kategori usaha wajib dipilih."),
  address: z.string().min(1, "Alamat usaha wajib diisi."),
  city: z.string().min(1, "Kota wajib dipilih."),
  description: z.string().optional(),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

const stepSlide: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: EASE } },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.3, ease: EASE },
  }),
};

function FieldUnderline({
  id,
  label,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline gap-4">
        <label
          htmlFor={id}
          className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]"
        >
          {label}
        </label>
      </div>
      <div className="group flex items-center gap-3 border-b border-[#DEDACF] pb-2 transition-colors duration-200 focus-within:border-[#225138]">
        <Icon className="h-4 w-4 shrink-0 text-[#6B6A63]/60 transition-colors duration-200 group-focus-within:text-[#225138]" />
        {children}
      </div>
    </div>
  );
}

function inputClass(additional?: string) {
  return `w-full bg-transparent py-1 font-sans text-[15px] text-[#1B3F2C] outline-none placeholder:text-[#6B6A63]/40 ${additional ?? ""}`;
}

export default function PenjualRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionUser, setSessionUser] = useState<{
    fullName: string;
    email: string;
  } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      businessName: "",
      category: "",
      address: "",
      city: "",
      description: "",
    },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;

        if (!session) {
          router.replace("/auth/login");
          return;
        }

        const user = session.user;
        const fullName =
          (user.user_metadata?.full_name as string) ||
          (user.email?.split("@")[0] ?? "");
        const email = user.email ?? "";

        setSessionUser({ fullName, email });
        step1Form.setValue("fullName", fullName);
        step1Form.setValue("email", email);
        setSessionReady(true);
      } catch {
        if (!cancelled) router.replace("/auth/login");
      }
    })();
    return () => {
      cancelled = true;
    };

  }, []);

  function goNext() {
    setDirection(1);
    setStep(2);
  }

  function goBack() {
    setDirection(-1);
    setStep(1);
  }

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

  async function onSubmit() {
    setError("");
    setLoading(true);

    try {
      const { supabase } = await import("@/lib/supabase");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/auth/login");
        return;
      }

      const s2 = step2Form.getValues();
      const userId = session.user.id;

      await supabase.auth.signUp({
        email: session.user.email,
        password: step1Form.getValues("password"),
        options: {
          data: {
            full_name: session.user.user_metadata?.full_name || step1Form.getValues("fullName"),
            role: "umkm",
          },
        },
      }).catch(() => {});

      let logoUrl: string | null = null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop() ?? "png";
        const path = `logos/${userId}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("umkm-logos")
          .upload(path, logoFile, { upsert: true });

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("umkm-logos").getPublicUrl(path);
          logoUrl = publicUrl;
        }
      }

      const { error: insertError } = await supabase
        .from("umkm_profiles")
        .insert({
          user_id: userId,
          business_name: s2.businessName,
          description: s2.description || null,
          category: s2.category,
          address: s2.address,
          city: s2.city,
          logo_url: logoUrl,
        });

      if (insertError) throw insertError;

      router.push("/dashboard/penjual");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (!sessionReady) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#225138] border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="mb-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full py-1.5 pr-3 font-sans text-sm font-medium text-[#6B6A63] transition-colors duration-200 hover:text-[#225138]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Kembali
        </Link>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mb-8 flex items-center justify-center gap-2.5 lg:hidden"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#225138] text-[#F7F5EF]">
          <Store className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </span>
        <span className="font-display text-xl font-medium tracking-tight text-[#225138]">
          ReBites
        </span>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-2">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              step >= 1
                ? "bg-[#225138] text-[#F7F5EF]"
                : "bg-[#DEDACF] text-[#6B6A63]"
            }`}
          >
            {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : "1"}
          </div>
          <div
            className={`h-px flex-1 transition-colors ${
              step >= 2 ? "bg-[#225138]" : "bg-[#DEDACF]"
            }`}
          />
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
              step >= 2
                ? "bg-[#225138] text-[#F7F5EF]"
                : "bg-[#DEDACF] text-[#6B6A63]"
            }`}
          >
            2
          </div>
        </div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-[#225138]"
      >
        {step === 1 ? "Buat Akun Penjual" : "Data Usaha"}
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="mt-3 font-sans text-sm leading-relaxed text-[#6B6A63]"
      >
        {step === 1
          ? "Lengkapi data akun Anda untuk melanjutkan."
          : "Ceritakan tentang usaha kuliner Anda."}
      </motion.p>

      <div className="mt-10 min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={stepSlide}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Form {...step1Form}>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    step1Form.handleSubmit(goNext)();
                  }}
                  noValidate
                >
                  <FormField
                    control={step1Form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FieldUnderline id="fullName" label="Nama Lengkap" icon={User}>
                          <input
                            id="fullName"
                            {...field}
                            readOnly
                            className={inputClass("cursor-default opacity-70")}
                          />
                        </FieldUnderline>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FieldUnderline id="email" label="Email Address" icon={Mail}>
                          <input
                            id="email"
                            type="email"
                            {...field}
                            readOnly
                            className={inputClass("cursor-default opacity-70")}
                          />
                        </FieldUnderline>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FieldUnderline id="password" label="Password" icon={Lock}>
                          <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className={inputClass()}
                            {...field}
                          />
                        </FieldUnderline>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FieldUnderline
                          id="confirmPassword"
                          label="Konfirmasi Password"
                          icon={Lock}
                        >
                          <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className={inputClass()}
                            {...field}
                          />
                        </FieldUnderline>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <p role="alert" className="font-sans text-[13px] text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#225138] px-5 py-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F7F5EF] transition-colors duration-200 hover:bg-[#1B3F2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#225138]"
                  >
                    Selanjutnya
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </Form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={stepSlide}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Form {...step2Form}>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    step2Form.handleSubmit(onSubmit)();
                  }}
                  noValidate
                >
                  <FormField
                    control={step2Form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FieldUnderline
                          id="businessName"
                          label="Nama Usaha"
                          icon={Store}
                        >
                          <input
                            id="businessName"
                            placeholder="Contoh: Warung Nasi Berkah"
                            className={inputClass()}
                            {...field}
                          />
                        </FieldUnderline>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <div className="mb-2.5 flex items-baseline gap-4">
                            <label className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]">
                              Kategori Usaha
                            </label>
                          </div>
                          <div className="flex items-center gap-3 border-b border-[#DEDACF] pb-2 transition-colors duration-200 focus-within:border-[#225138]">
                            <Tag className="h-4 w-4 shrink-0 text-[#6B6A63]/60" />
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full border-0 border-b-[#DEDACF] bg-transparent px-0 py-1 font-sans text-[15px] text-[#1B3F2C] shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:text-left">
                                <SelectValue placeholder="Pilih kategori kuliner" />
                              </SelectTrigger>
                              <SelectContent>
                                {KATEGORI_KULINER.map((k) => (
                                  <SelectItem key={k} value={k}>
                                    {k}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <div className="mb-2.5 flex items-baseline gap-4">
                            <label className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]">
                              Kota
                            </label>
                          </div>
                          <div className="flex items-center gap-3 border-b border-[#DEDACF] pb-2 transition-colors duration-200 focus-within:border-[#225138]">
                            <MapPin className="h-4 w-4 shrink-0 text-[#6B6A63]/60" />
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full border-0 border-b-[#DEDACF] bg-transparent px-0 py-1 font-sans text-[15px] text-[#1B3F2C] shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:text-left">
                                <SelectValue placeholder="Pilih kota (Jabodetabek)" />
                              </SelectTrigger>
                              <SelectContent>
                                {KOTA_JABODETABEK.map((k) => (
                                  <SelectItem key={k} value={k}>
                                    {k}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FieldUnderline
                          id="address"
                          label="Alamat Usaha"
                          icon={MapPin}
                        >
                          <input
                            id="address"
                            placeholder="Jl. contoh no. 123, RT/RW"
                            className={inputClass()}
                            {...field}
                          />
                        </FieldUnderline>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <div className="mb-2.5 flex items-baseline justify-between gap-4">
                            <label
                              htmlFor="description"
                              className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]"
                            >
                              Deskripsi Usaha
                            </label>
                            <span className="font-sans text-[10px] text-[#6B6A63]/50">
                              Opsional
                            </span>
                          </div>
                          <div className="group flex items-start gap-3 border-b border-[#DEDACF] pb-2 transition-colors duration-200 focus-within:border-[#225138]">
                            <Store className="mt-2 h-4 w-4 shrink-0 text-[#6B6A63]/60 transition-colors duration-200 group-focus-within:text-[#225138]" />
                            <Textarea
                              id="description"
                              placeholder="Ceritakan tentang usaha Anda..."
                              rows={3}
                              className="resize-none border-0 border-b-0 bg-transparent px-0 py-1 font-sans text-[15px] text-[#1B3F2C] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#6B6A63]/40"
                              {...field}
                            />
                          </div>
                        </div>
                        <FormMessage className="font-sans text-[13px]" />
                      </FormItem>
                    )}
                  />

                  <div>
                    <div className="mb-2.5 flex items-baseline justify-between gap-4">
                      <label className="block font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B6A63]">
                        Gambar Toko
                      </label>
                      <span className="font-sans text-[10px] text-[#6B6A63]/50">
                        Opsional
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-[#DEDACF] bg-[#F7F5EF]">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-[#6B6A63]/40" />
                        )}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="rounded-md border border-[#DEDACF] bg-[#F7F5EF] px-4 py-2 font-sans text-xs font-medium text-[#225138] transition-colors hover:bg-[#DEDACF]/30"
                        >
                          {logoFile ? "Ganti Logo" : "Pilih Logo"}
                        </button>
                        <p className="mt-1 font-sans text-[10px] text-[#6B6A63]/60">
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
                    <p role="alert" className="font-sans text-[13px] text-red-600">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex items-center justify-center gap-2 rounded-md border border-[#DEDACF] bg-transparent px-5 py-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[#6B6A63] transition-colors duration-200 hover:bg-[#DEDACF]/30"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#225138] px-5 py-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-[#F7F5EF] transition-colors duration-200 hover:bg-[#1B3F2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#225138] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? "Mendaftar..." : "Buat Akun"}
                      {!loading && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.p
        variants={itemVariants}
        className="mt-8 text-center font-sans text-sm text-[#6B6A63]"
      >
        Sudah punya akun penjual?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-[#225138] underline underline-offset-4 transition-colors hover:text-[#1B3F2C]"
        >
          Masuk
        </Link>
      </motion.p>
    </motion.div>
  );
}
