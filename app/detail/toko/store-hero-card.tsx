"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronRight,
  Heart,
  MapPin,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vendor } from "@/lib/types";
import { Badge } from "@/app/components/Badge";
import { SmartImage } from "@/app/components/SmartImage";
import { DotPattern, LeafSprig } from "@/app/components/dashboardPenjual/decor";
import { getVendorProfile } from "./vendor-profiles";
import { useSellerPlan } from "@/lib/seller-plan";

interface StoreHeroCardProps {
  vendor: Vendor;
  openNow: boolean;
}

export function StoreHeroCard({ vendor, openNow }: StoreHeroCardProps) {
  const [following, setFollowing] = useState(false);
  const profile = getVendorProfile(vendor.id);
  const { plan } = useSellerPlan();

  return (
    <section>
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-green-600 sm:h-56">
        <DotPattern className="right-0 top-0 h-56 w-56 text-cream-50/10" />
        <LeafSprig className="-bottom-10 -right-6 h-56 w-56 text-cream-50/15" />
      </div>

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative -mt-14 sm:-mt-16"
        >
          <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-xl shadow-forest-900/10 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative -mt-16 h-28 w-28 shrink-0 overflow-hidden rounded-full bg-sage-100 ring-4 ring-white shadow-lg sm:-mt-20 sm:h-32 sm:w-32">
                  <SmartImage
                    src={vendor.image}
                    alt={`Foto ${vendor.name}`}
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-medium leading-tight tracking-tight text-forest-900 sm:text-3xl">
                      {vendor.name}
                    </h1>
                    <Badge variant="cream">{profile.tier}</Badge>
                    {vendor.isRescuePartner && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-700 px-2.5 py-1 text-[10px] font-bold text-white">
                        <BadgeCheck className="h-3 w-3" />
                        Rescue Partner
                      </span>
                    )}
                    {plan.verifiedBadge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-[10px] font-bold text-charcoal-900">
                        <BadgeCheck className="h-3 w-3" />
                        UMKM Terverifikasi
                      </span>
                    )}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold",
                        openNow
                          ? "bg-green-600 text-white"
                          : "bg-charcoal-500 text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          openNow ? "bg-white" : "bg-red-500",
                        )}
                      />
                      {openNow ? "Buka Sekarang" : "Tutup"}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-charcoal-500">
                    <span className="flex items-center gap-1 font-semibold text-charcoal-900">
                      <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                      {vendor.rating.toFixed(1)}
                      <span className="font-normal text-charcoal-500">
                        · {vendor.distanceKm} km dari kamu
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-sage-500" />
                      {profile.followers} pengikut
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-sage-500" />
                      {vendor.address}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-medium text-green-700">
                    {profile.tagline}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setFollowing((v) => !v)}
                  aria-pressed={following}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200",
                    following
                      ? "bg-green-700 text-white hover:bg-green-600"
                      : "border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white",
                  )}
                >
                  {following ? (
                    <Heart className="h-4 w-4 fill-current" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {following ? "Mengikuti" : "Ikuti Toko"}
                </button>
                <a
                  href="#menu-surplus"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-700/25 transition-colors hover:bg-green-600"
                >
                  Pesan Surplus
                </a>
              </div>
            </div>

            <p className="mt-6 border-t border-sage-100 pt-5 text-sm leading-relaxed text-charcoal-500">
              {vendor.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
