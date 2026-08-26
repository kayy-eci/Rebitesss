import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/server/supabase';
import { computePeriodEnd } from '@/lib/subscription-plans';

export const runtime = 'nodejs';

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

interface XenditCallback {
  id: string;
  external_id: string;
  status: string;
  amount?: number;
  paid_amount?: number;
  payment_method?: string;
  payment_channel?: string;
  payment_destination?: string;
  payer_email?: string;
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-callback-token');
  const expected = process.env.XENDIT_CALLBACK_TOKEN;

  if (!expected) {
    console.error('[webhook/xendit] XENDIT_CALLBACK_TOKEN belum di-set');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  if (!token || !timingSafeEqual(token, expected)) {
    console.warn('[webhook/xendit] invalid callback token');
    return NextResponse.json({ error: 'Invalid callback token' }, { status: 401 });
  }

  let payload: XenditCallback;
  try {
    payload = (await req.json()) as XenditCallback;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { id: invoiceId, external_id: externalId, status } = payload;
  if (!externalId || !invoiceId) {
    return NextResponse.json({ error: 'Missing external_id or id' }, { status: 400 });
  }

  const service = createServiceClient();
  const normalizedStatus = String(status).toUpperCase();

  // ------------------------------------------------------------
  // ORDER flow: external_id = RB-xxx
  // ------------------------------------------------------------
  if (externalId.startsWith('RB-')) {
    // Idempotency: cek apakah sudah paid
    const { data: order } = await service
      .from('orders')
      .select('order_code, payment_status, product_slug, quantity, coin_used, coin_earned, buyer_id, vendor_name, product_name, total_price')
      .eq('order_code', externalId)
      .maybeSingle();

    if (!order) {
      console.warn('[webhook/xendit] order not found', externalId);
      return NextResponse.json({ received: true, note: 'order not found' });
    }

    const row = order as Record<string, unknown>;
    const currentPayment = row.payment_status as string;

    if (normalizedStatus === 'PAID' || normalizedStatus === 'SETTLED') {
      if (currentPayment === 'paid') {
        return NextResponse.json({ received: true, already: 'paid' });
      }

      // Mark paid — bypass guard karena pakai service_role
      const { error: updErr } = await service
        .from('orders')
        .update({
          payment_status: 'paid',
          order_status: 'paid',
          payment_method_id: payload.payment_channel ?? payload.payment_method ?? 'xendit',
          xendit_invoice_id: invoiceId,
          midtrans_order_id: invoiceId,
        } as Record<string, unknown>)
        .eq('order_code', externalId);

      if (updErr) {
        console.error('[webhook/xendit] update paid error', updErr.message);
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
      }

      // Settle coins (idempoten: cek existing)
      const coinUsed = Number(row.coin_used ?? 0);
      const coinEarned = Number(row.coin_earned ?? 0);
      const buyerId = row.buyer_id as string;
      if (buyerId && (coinUsed > 0 || coinEarned > 0)) {
        const { data: existing } = await service
          .from('coin_transactions')
          .select('type')
          .eq('user_id', buyerId)
          .eq('order_code', externalId);
        const existingTypes = new Set(((existing ?? []) as Array<{ type: string }>).map((r) => r.type));
        const pending: Record<string, unknown>[] = [];
        if (coinUsed > 0 && !existingTypes.has('spent')) {
          pending.push({ user_id: buyerId, order_code: externalId, type: 'spent', amount: coinUsed, description: 'Potongan pesanan' });
        }
        if (coinEarned > 0 && !existingTypes.has('earned')) {
          pending.push({ user_id: buyerId, order_code: externalId, type: 'earned', amount: coinEarned, description: 'Reward pembelian' });
        }
        if (pending.length > 0) {
          await service.from('coin_transactions').insert(pending);
        }
      }

      // Notifikasi buyer
      if (buyerId) {
        const productName = (row.product_name as string) ?? 'Pesanan';
        const vendorName = (row.vendor_name as string) ?? 'Toko';
        const totalPrice = Number(row.total_price ?? 0);
        await service.from('notifications').insert([
          {
            user_id: buyerId,
            role: 'buyer',
            type: 'payment_success',
            title: 'Pembayaran Berhasil',
            message: `Pembayaran Rp${totalPrice.toLocaleString('id-ID')} untuk ${productName} via ${payload.payment_channel ?? 'Xendit'} berhasil.`,
            reference_id: externalId,
            href: '/riwayatPesanan',
          },
          {
            user_id: buyerId,
            role: 'buyer',
            type: 'order_created',
            title: 'Pesanan Diproses',
            message: `Pesanan #${externalId} dari ${vendorName} sedang diproses.`,
            reference_id: externalId,
            href: '/riwayatPesanan',
          },
        ]);

        // Notifikasi seller
        const vendorSlug = (row as Record<string, unknown>).vendor_slug as string | undefined;
        if (vendorSlug) {
          const { data: umkm } = await service
            .from('umkm_profiles')
            .select('user_id')
            .eq('slug', vendorSlug)
            .maybeSingle();
          const sellerId = umkm ? (umkm as Record<string, string>).user_id : null;
          if (sellerId) {
            await service.from('notifications').insert({
              user_id: sellerId,
              role: 'seller',
              type: 'incoming_order',
              title: 'Pesanan Masuk!',
              message: `Pesanan #${externalId} — ${productName} telah dibayar. Segera siapkan pesanan.`,
              reference_id: externalId,
              href: '/dashboard/penjual/pesanan',
            });
          }
        }
      }
    } else if (normalizedStatus === 'EXPIRED') {
      if (currentPayment === 'paid') {
        return NextResponse.json({ received: true, already: 'paid' });
      }
      const slug = (row.product_slug as string) ?? null;
      const qty = Number(row.quantity ?? 1);
      if (slug && qty > 0) {
        await service.rpc('release_stock', { p_slug: slug, p_quantity: qty });
      }
      await service
        .from('orders')
        .update({
          payment_status: 'failed',
          order_status: 'cancelled',
          xendit_invoice_id: invoiceId,
        } as Record<string, unknown>)
        .eq('order_code', externalId);
    } else if (normalizedStatus === 'FAILED' || normalizedStatus === 'VOIDED') {
      const slug2 = (row.product_slug as string) ?? null;
      const qty2 = Number(row.quantity ?? 1);
      if (currentPayment !== 'paid' && slug2 && qty2 > 0) {
        await service.rpc('release_stock', { p_slug: slug2, p_quantity: qty2 });
      }
      await service
        .from('orders')
        .update({
          payment_status: 'failed',
          order_status: 'cancelled',
          xendit_invoice_id: invoiceId,
        } as Record<string, unknown>)
        .eq('order_code', externalId);
    }

    return NextResponse.json({ received: true });
  }

  // ------------------------------------------------------------
  // SUBSCRIPTION flow: external_id = SUB-xxx
  // ------------------------------------------------------------
  if (externalId.startsWith('SUB-')) {
    if (normalizedStatus === 'PAID' || normalizedStatus === 'SETTLED') {
      // Cari subscription pending dengan invoice id ini
      const { data: sub } = await service
        .from('subscriptions')
        .select('id, umkm_id, plan_id, billing, price_paid, status, xendit_invoice_id')
        .eq('xendit_invoice_id', invoiceId)
        .maybeSingle();

      // Fallback: coba cari via external_id di log (kalau insert belum sempat)
      let subRow = sub as Record<string, unknown> | null;
      if (!subRow) {
        // externalId berisi short umkm; coba cari pending terbaru untuk fallback
        console.warn('[webhook/xendit] sub not found by invoice, trying by status pending');
        // Biarkan tetap warn — invoice sudah paid tapi pending row tidak ada = bikin baru
      }

      if (subRow && subRow.status === 'active') {
        return NextResponse.json({ received: true, already: 'active' });
      }

      // Ambil plan & billing dari subRow atau dari payload description (parse)
      // Jika pending row ada, kita aktivasi. Jika tidak ada (edge), coba buat dari externalId parsing — skip, balikin ok.
      if (subRow) {
        const billing = (subRow.billing as string) ?? 'monthly';
        const now = new Date();
        const periodEnd = computePeriodEnd(billing as 'monthly' | 'yearly', now.getTime());
        const periodStart = now.toISOString();

        await service
          .from('subscriptions')
          .update({
            status: 'active',
            xendit_status: 'PAID',
            current_period_start: periodStart,
            current_period_end: periodEnd.toISOString(),
            updated_at: now.toISOString(),
            payment_method_id: payload.payment_channel ?? 'xendit',
          } as Record<string, unknown>)
          .eq('id', subRow.id as string);

        // Notif seller
        const umkmId = subRow.umkm_id as string;
        const { data: umkm2 } = await service
          .from('umkm_profiles')
          .select('user_id, name')
          .eq('id', umkmId)
          .maybeSingle();
        if (umkm2) {
          const sellerId = (umkm2 as Record<string, string>).user_id;
          await service.from('notifications').insert({
            user_id: sellerId,
            role: 'seller',
            type: 'payment_success',
            title: 'Langganan Aktif!',
            message: `Pembayaran langganan ReBites berhasil. Paket aktif hingga ${periodEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
            reference_id: externalId,
            href: '/dashboard/penjual/langganan',
          });
        }
      }
    } else if (normalizedStatus === 'EXPIRED' || normalizedStatus === 'FAILED' || normalizedStatus === 'VOIDED') {
      await service
        .from('subscriptions')
        .update({ status: 'expired', xendit_status: normalizedStatus } as Record<string, unknown>)
        .eq('xendit_invoice_id', invoiceId);
    }

    return NextResponse.json({ received: true });
  }

  // Unknown prefix
  console.warn('[webhook/xendit] unknown external_id', externalId);
  return NextResponse.json({ received: true, note: 'unknown prefix' });
}
