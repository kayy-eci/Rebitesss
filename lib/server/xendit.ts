/**
 * Helper Xendit Invoice API — server only.
 * Docs: https://developers.xendit.co/api-reference#create-invoice
 */

const XENDIT_API_BASE = 'https://api.xendit.co';

export interface CreateInvoiceParams {
  externalId: string;
  amount: number;
  payerEmail: string | null;
  description: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  customerName?: string;
}

export interface XenditInvoice {
  id: string;
  external_id: string;
  amount: number;
  status: string;
  invoice_url: string;
  expiry_date: string;
}

function getSecretKey(): string {
  const key = process.env.XENDIT_SECRET_KEY;
  if (!key) throw new Error('Missing env: XENDIT_SECRET_KEY');
  return key;
}

export async function createXenditInvoice(
  params: CreateInvoiceParams
): Promise<XenditInvoice> {
  const secret = getSecretKey();
  // Xendit pakai Basic auth: base64(secret + ":")
  const auth = Buffer.from(`${secret}:`).toString('base64');

  const body: Record<string, unknown> = {
    external_id: params.externalId,
    amount: params.amount,
    description: params.description,
    currency: 'IDR',
    // Xendit memerlukan minimal 1 jam? Default 1 hari. Kita samakan dengan
    // reservation countdown (1 jam) agar stok tidak ditahan terlalu lama.
    invoice_duration: 3600,
    success_redirect_url: params.successRedirectUrl,
    failure_redirect_url: params.failureRedirectUrl,
  };

  if (params.payerEmail) {
    body.payer_email = params.payerEmail;
  }
  if (params.customerName) {
    body.customer = { given_names: params.customerName };
  }

  const res = await fetch(`${XENDIT_API_BASE}/v2/invoices`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      (json as { message?: string })?.message ??
      (json as { error_code?: string })?.error_code ??
      `Xendit error ${res.status}`;
    throw new Error(msg);
  }

  return json as XenditInvoice;
}
