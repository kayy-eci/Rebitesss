import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient, getSiteUrl, getUserFromBearer } from '@/lib/server/supabase';
import { createXenditInvoice } from '@/lib/server/xendit';
import { SUBSCRIPTION_PLANS, getPlanPrice, computePeriodEnd, type BillingCycle } from '@/lib/subscription-plans';

export const runtime = 'nodejs';

/**
 * POST /api/subscriptions/xendit
 * Body: { planSlug: 'basic'|'standar'|'premium', billing: 'monthly'|'yearly' }
 * Auth: Bearer token
 *
 * Semua paket berbayar via Xendit (Basic 24.999 wajib).
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromBearer(req.headers.get('authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Silakan login.' }, { status: 401 });
    }

    const body = await req.json().catch(() => null) as {
      planSlug?: string;
      billing?: string;
    } | null;

    const planSlug = body?.planSlug as 'basic' | 'standar' | 'premium' | undefined;
    const billing = (body?.billing === 'yearly' ? 'yearly' : 'monthly') as BillingCycle;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.slug === planSlug);
    if (!plan) {
      return NextResponse.json({ error: 'Paket tidak ditemukan.' }, { status: 400 });
    }

    const service = createServiceClient();

    // Cari UMKM milik user
    const { data: umkm } = await service
      .from('umkm_profiles')
      .select('id, slug, name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!umkm) {
      return NextResponse.json({ error: 'Profil UMKM belum ada. Lengkapkan profil penjual dulu.' }, { status: 400 });
    }

    const umkmId = (umkm as Record<string, string>).id;
    const planPrice = getPlanPrice(plan, billing);
    // Pajak 2% menggantikan Platform Fee $4 di desain referensi
    const tax = Math.round(planPrice * 0.02);
    const totalAmount = planPrice + tax;

    // Cari plan_id dari DB berdasarkan slug
    const { data: planRow } = await service
      .from('plans')
      .select('id')
      .eq('slug', plan.slug)
      .maybeSingle();

    if (!planRow) {
      return NextResponse.json({ error: 'Plan ID tidak ditemukan di database.' }, { status: 500 });
    }
    const planId = (planRow as Record<string, string>).id;

    const shortId = umkmId.slice(0, 6).toUpperCase();
    const stamp = Date.now().toString(36).toUpperCase();
    const externalId = `SUB-${shortId}-${stamp}`;

    const siteUrl = getSiteUrl();
    const successUrl = `${siteUrl}/langganan/sukses?plan=${plan.slug}&billing=${billing}&external_id=${encodeURIComponent(externalId)}`;
    const failureUrl = `${siteUrl}/dashboard/penjual/langganan?payment=failed`;

    // Buat invoice Xendit (total sudah termasuk pajak 2%)
    let invoice;
    try {
      invoice = await createXenditInvoice({
        externalId,
        amount: totalAmount,
        payerEmail: user.email,
        description: `ReBites ${plan.name} (${billing}) - Subtotal ${planPrice} + Pajak 2% ${tax} - ${shortId}`,
        successRedirectUrl: successUrl,
        failureRedirectUrl: failureUrl,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Gagal membuat invoice.';
      console.error('[subscriptions/xendit] xendit error', msg);
      return NextResponse.json({ error: `Gagal membuat invoice: ${msg}` }, { status: 502 });
    }

    // Simpan pending subscription — status pending, tunggu webhook untuk active
    // Gunakan upsert: hapus pending lama untuk plan yang sama bila ada (opsional)
    const { error: insertErr } = await service.from('subscriptions').insert({
      umkm_id: umkmId,
      plan_id: planId,
      status: 'pending',
      billing,
      price_paid: totalAmount,
      xendit_invoice_id: invoice.id,
      xendit_status: 'PENDING',
      // current_period akan diisi webhook saat paid
    } as Record<string, unknown>);

    if (insertErr) {
      console.error('[subscriptions/xendit] insert pending error', insertErr.message);
      // Jangan batalkan invoice Xendit yang sudah jadi — tetap balikin URL agar user bisa bayar,
      // webhook nanti tetap bisa upsert berdasarkan external_id/invoice id.
    }

    return NextResponse.json({
      externalId,
      invoiceUrl: invoice.invoice_url,
      invoiceId: invoice.id,
      amount: totalAmount,
      subtotal: planPrice,
      tax,
    });
  } catch (err: unknown) {
    console.error('[subscriptions/xendit] unexpected', err);
    const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
