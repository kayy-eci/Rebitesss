"use client";

import Image from "next/image";
import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Store,
  MapPin,
  Tag,
  ImageIcon,
  User,
  Mail,
  Lock,
  CheckCircle2,
  ChevronDown,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { Checkbox } from "@/app/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { SELLER_STATUS_UPDATED_EVENT } from "@/hooks/use-seller-status";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const KECAMATAN_DEPOK = [
  "Beji",
  "Bojongsari",
  "Cilodong",
  "Cimanggis",
  "Cinere",
  "Cipayung",
  "Limo",
  "Pancoran Mas",
  "Sawangan",
  "Sukmajaya",
  "Tapos",
] as const;

const KATEGORI_KULINER = [
  "Makanan Berat",
  "Jajanan",
  "Dessert",
  "Japanese",
  "Roti & Kue",
  "Makanan Cepat Saji",
  "Buah & Sayur",
  "Minuman",
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
  categories: z.array(z.string()).min(1, "Pilih minimal satu kategori usaha."),
  address: z.string().min(1, "Alamat usaha wajib diisi."),
  city: z.string().min(1, "Kecamatan wajib dipilih."),
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
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
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

// Boxed field like reference image: rounded border, light bg, focus ring
function FieldBox({
  id,
  label,
  icon: Icon,
  children,
  trailing,
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B6A63]"
      >
        {label}
      </label>
      <div className="group flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 transition-colors duration-200 focus-within:border-[#225138] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#225138]/15">
        <Icon className="h-3.5 w-3.5 shrink-0 text-[#6B6A63]/55 transition-colors duration-200 group-focus-within:text-[#225138]" />
        {children}
        {trailing}
      </div>
    </div>
  );
}

function PasswordVisibilityButton({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
      aria-pressed={visible}
      className="shrink-0 rounded-sm p-0.5 text-[#6B6A63]/55 transition-colors duration-200 hover:text-[#225138] focus-visible:text-[#225138] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#225138]/30"
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

function inputClass(additional?: string) {
  return `w-full bg-transparent py-1 font-sans text-[14px] leading-none text-[#1B3F2C] outline-none placeholder:text-[#9A9994] ${additional ?? ""}`;
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "toko"
  );
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 7);
}

export default function PenjualRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      categories: [],
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
  }, [router, step1Form]);

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

      // Cegah toko duplikat: kalau user sudah punya UMKM, langsung ke dashboard.
      const { data: existingUmkm } = await supabase
        .from("umkm_profiles")
        .select("id")
        .eq("user_id", userId)
        .limit(1);
      if (existingUmkm && existingUmkm.length > 0) {
        window.dispatchEvent(new Event(SELLER_STATUS_UPDATED_EVENT));
        router.push("/dashboard/penjual");
        return;
      }

      // Verifikasi identitas: konfirmasi ulang password sesi yang aktif.
      // TIDAK membuat akun baru dan TIDAK mengganti user yang sedang login.
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: session.user.email ?? "",
        password: step1Form.getValues("password"),
      });
      if (verifyError) {
        setError("Kata sandi salah. Konfirmasi kata sandi akun kamu.");
        return;
      }

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

      const slugBase = slugify(s2.businessName);
      let slug = `${slugBase}-${randomSuffix()}`;
      let insertPayloadError: { code?: string; message: string } | null = null;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const { error } = await supabase.from("umkm_profiles").insert({
          user_id: userId,
          slug,
          business_name: s2.businessName,
          description: s2.description || null,
          category: s2.categories.join(", "),
          address: s2.address,
          city: s2.city,
          logo_url: logoUrl,
        });
        if (!error) {
          insertPayloadError = null;
          break;
        }
        insertPayloadError = error as { code?: string; message: string };
        if (error.code !== "23505") break;
        slug = `${slugBase}-${randomSuffix()}`;
      }

      if (insertPayloadError) {
        throw new Error(insertPayloadError.message);
      }

      window.dispatchEvent(new Event(SELLER_STATUS_UPDATED_EVENT));
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
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
      <motion.div variants={itemVariants} className="mb-3 flex-shrink-0">
        <Link
          href="/home"
          className="group inline-flex items-center gap-1.5 rounded-full py-1 pr-2 font-sans text-[13px] font-medium text-[#6B6A63] transition-colors duration-200 hover:text-[#225138]"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Kembali
        </Link>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mb-5 flex items-center justify-center gap-2 lg:hidden flex-shrink-0"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#225138] text-[#F7F5EF]">
          <Store className="h-[15px] w-[15px]" strokeWidth={1.75} />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight text-[#225138]">
          ReBites
        </span>
      </motion.div>

      {/* Stepper like reference - minimal dots with line */}
      <motion.div variants={itemVariants} className="mb-5 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
              step >= 1
                ? "bg-[#225138] text-white shadow-sm"
                : "bg-[#EDE9DE] text-[#6B6A63]"
            }`}
          >
            {step > 1 ? <CheckCircle2 className="h-3.5 w-3.5" /> : "1"}
          </div>
          <div
            className={`h-px flex-1 transition-colors ${
              step >= 2 ? "bg-[#225138]" : "bg-[#E5E7EB]"
            }`}
          />
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
              step >= 2
                ? "bg-[#225138] text-white shadow-sm"
                : "bg-[#EDE9DE] text-[#6B6A63]"
            }`}
          >
            2
          </div>
        </div>
        <div className="mt-2 flex justify-between">
          <span className={`font-sans text-[10px] font-semibold uppercase tracking-widest ${step===1 ? "text-[#225138]" : "text-[#9A9994]"}`}>Akun</span>
          <span className={`font-sans text-[10px] font-semibold uppercase tracking-widest ${step===2 ? "text-[#225138]" : "text-[#9A9994]"}`}>Usaha</span>
        </div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="font-display text-[22px] font-bold leading-[1.1] tracking-[-0.02em] text-[#14261E] flex-shrink-0"
      >
        {step === 1 ? "Buat Akun Penjual" : "Data Usaha"}
      </motion.h1>
      <motion.p
        variants={itemVariants}
        className="mt-1.5 font-sans text-[13px] leading-relaxed text-[#6B6A63] flex-shrink-0"
      >
        {step === 1
          ? "Verifikasi akun Anda untuk melanjutkan. Email & nama sudah sesuai sesi login."
          : "Ceritakan tentang usaha kuliner Anda untuk tampil di ReBites."}
      </motion.p>

      <div className="mt-4 flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1.5 -mr-1.5 pb-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#E5E7EB] [&::-webkit-scrollbar-track]:bg-transparent">
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
                  className="grid grid-cols-1 gap-4"
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
                        <FieldBox
                          id="fullName"
                          label="Nama Lengkap"
                          icon={User}
                        >
                          <input
                            id="fullName"
                            {...field}
                            readOnly
                            className={inputClass("cursor-default opacity-60")}
                          />
                        </FieldBox>
                        <FormMessage className="font-sans text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FieldBox
                          id="email"
                          label="Email Address"
                          icon={Mail}
                        >
                          <input
                            id="email"
                            type="email"
                            {...field}
                            readOnly
                            className={inputClass("cursor-default opacity-60")}
                          />
                        </FieldBox>
                        <FormMessage className="font-sans text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FieldBox
                          id="password"
                          label="Password"
                          icon={Lock}
                          trailing={
                            <PasswordVisibilityButton
                              visible={showPassword}
                              onToggle={() => setShowPassword((v) => !v)}
                            />
                          }
                        >
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className={inputClass()}
                            {...field}
                          />
                        </FieldBox>
                        <FormMessage className="font-sans text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step1Form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FieldBox
                          id="confirmPassword"
                          label="Konfirmasi Password"
                          icon={Lock}
                          trailing={
                            <PasswordVisibilityButton
                              visible={showConfirmPassword}
                              onToggle={() => setShowConfirmPassword((v) => !v)}
                            />
                          }
                        >
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className={inputClass()}
                            {...field}
                          />
                        </FieldBox>
                        <FormMessage className="font-sans text-[12px]" />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-sans text-[12px] leading-relaxed text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#143B2D] px-4 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-colors duration-200 hover:bg-[#0F2E24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#225138]"
                  >
                    Selanjutnya
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
                  className="grid grid-cols-1 gap-3"
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
                        <FieldBox
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
                        </FieldBox>
                        <FormMessage className="font-sans text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="categories"
                    render={({ field }) => {
                      const selected = (field.value ?? []) as string[];
                      const toggleCategory = (k: string) => {
                        const next = selected.includes(k)
                          ? selected.filter((c) => c !== k)
                          : [...selected, k];
                        field.onChange(next);
                      };
                      return (
                        <FormItem>
                          <div>
                            <div className="mb-1.5 flex items-baseline justify-between gap-3">
                              <label className="block font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B6A63]">
                                Kategori Jualan
                              </label>
                              <span className="font-sans text-[10px] text-[#9A9994]">
                                Bisa lebih dari satu
                              </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 transition-colors duration-200 focus-within:border-[#225138] focus-within:ring-1 focus-within:ring-[#225138]/15">
                              <Tag className="h-3.5 w-3.5 shrink-0 text-[#6B6A63]/55" />
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    aria-label="Pilih kategori jualan"
                                    className={cn(
                                      "flex w-full items-center justify-between gap-2 bg-transparent text-left font-sans text-[14px] outline-none",
                                      selected.length > 0
                                        ? "text-[#1B3F2C]"
                                        : "text-[#9A9994]",
                                    )}
                                  >
                                    <span className="truncate">
                                      {selected.length > 0
                                        ? selected.join(", ")
                                        : "Pilih kategori kuliner"}
                                    </span>
                                    <ChevronDown className="h-4 w-4 shrink-0 opacity-40" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="start"
                                  className="w-72 rounded-xl border-[#E5E7EB] p-2"
                                >
                                  <div className="space-y-0.5">
                                    {KATEGORI_KULINER.map((k) => {
                                      const checked = selected.includes(k);
                                      return (
                                        <label
                                          key={k}
                                          className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-[#F7F5EF]"
                                        >
                                          <Checkbox
                                            checked={checked}
                                            onCheckedChange={() =>
                                              toggleCategory(k)
                                            }
                                            className="data-[state=checked]:border-[#225138] data-[state=checked]:bg-[#225138]"
                                          />
                                          <span className="font-sans text-sm text-[#1B3F2C]">
                                            {k}
                                          </span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <FormMessage className="font-sans text-[12px]" />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={step2Form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <label className="mb-1.5 block font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B6A63]">
                            Kecamatan (Depok)
                          </label>
                          <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 transition-colors duration-200 focus-within:border-[#225138] focus-within:ring-1 focus-within:ring-[#225138]/15">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6B6A63]/55" />
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full border-0 bg-transparent p-0 font-sans text-[14px] text-[#1B3F2C] shadow-none focus:ring-0 focus:ring-offset-0 h-auto py-1 [&>span]:text-left">
                                <SelectValue placeholder="Pilih kecamatan di Depok" />
                              </SelectTrigger>
                              <SelectContent>
                                {KECAMATAN_DEPOK.map((k) => (
                                  <SelectItem key={k} value={k}>
                                    {k}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <FormMessage className="font-sans text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FieldBox
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
                        </FieldBox>
                        <FormMessage className="font-sans text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <div className="mb-1.5 flex items-baseline justify-between gap-3">
                            <label
                              htmlFor="description"
                              className="block font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B6A63]"
                            >
                              Deskripsi Usaha
                            </label>
                            <span className="font-sans text-[10px] text-[#9A9994]">
                              Opsional
                            </span>
                          </div>
                          <div className="group flex items-start gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 transition-colors duration-200 focus-within:border-[#225138] focus-within:ring-1 focus-within:ring-[#225138]/15">
                            <Store className="mt-2 h-3.5 w-3.5 shrink-0 text-[#6B6A63]/55 transition-colors duration-200 group-focus-within:text-[#225138]" />
                            <Textarea
                              id="description"
                              placeholder="Ceritakan tentang usaha Anda..."
                              rows={2}
                              className="min-h-[56px] resize-none border-0 bg-transparent p-0 py-1 font-sans text-[14px] leading-relaxed text-[#1B3F2C] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#9A9994]"
                              {...field}
                            />
                          </div>
                        </div>
                        <FormMessage className="font-sans text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <label className="block font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6B6A63]">
                        Gambar Toko
                      </label>
                      <span className="font-sans text-[10px] text-[#9A9994]">
                        Opsional
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#E5E7EB] bg-[#FCFCF9] px-3 py-2.5">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
                        {logoPreview ? (
                          <Image
                            src={logoPreview}
                            alt="Logo preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-[#9A9994]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 font-sans text-[11px] font-medium text-[#225138] shadow-sm transition-colors hover:bg-[#F7F5EF]"
                        >
                          {logoFile ? "Ganti Logo" : "Pilih Logo"}
                        </button>
                        <p className="mt-1 font-sans text-[10px] text-[#9A9994]">
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
                    <p
                      role="alert"
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-sans text-[12px] leading-relaxed text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B6A63] shadow-sm transition-colors duration-200 hover:bg-[#F7F5EF]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#143B2D] px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm transition-colors duration-200 hover:bg-[#0F2E24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#225138] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? "Mendaftar..." : "Buat Akun"}
                      {!loading && <ArrowRight className="h-3.5 w-3.5" />}
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
        className="mt-6 text-center font-sans text-[13px] text-[#6B6A63] flex-shrink-0"
      >
        Sudah punya toko?{" "}
        <Link
          href="/auth/login/penjual"
          className="font-semibold text-[#225138] underline underline-offset-4 transition-colors hover:text-[#1B3F2C]"
        >
          Masuk sebagai penjual
        </Link>
      </motion.p>
    </motion.div>
  );
}
