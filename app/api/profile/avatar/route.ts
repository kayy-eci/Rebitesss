import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient, getUserFromBearer } from '@/lib/server/supabase';

export const runtime = 'nodejs';

/**
 * POST /api/profile/avatar — upload foto profil ke bucket `avatars`
 * Auth: Authorization: Bearer <supabase access_token>
 * Body: multipart/form-data, field `file` (JPG/PNG/WebP, maks 2MB)
 *
 * Path: {uid}/avatar.{ext} (upsert) lalu update profiles.avatar_url.
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest) {
  const user = await getUserFromBearer(req.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Silakan login ulang.' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Body harus multipart/form-data.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Field `file` wajib diisi.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Format file harus JPG, JPEG, PNG, atau WebP.' },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Ukuran file maksimal 2MB.' }, { status: 400 });
  }

  const extFromName = file.name.split('.').pop()?.toLowerCase() ?? '';
  const ext = ['jpg', 'jpeg', 'png', 'webp'].includes(extFromName)
    ? extFromName === 'jpeg'
      ? 'jpg'
      : extFromName
    : file.type === 'image/png'
      ? 'png'
      : file.type === 'image/webp'
        ? 'webp'
        : 'jpg';

  const path = `${user.id}/avatar.${ext}`;
  const service = createServiceClient();

  const { error: uploadError } = await service.storage
    .from('avatars')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    console.error('[profile/avatar] upload error', uploadError.message);
    return NextResponse.json({ error: 'Gagal upload foto.' }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = service.storage.from('avatars').getPublicUrl(path);

  // Bust cache dengan timestamp (membantu browser cache invalidation)
  const finalUrl = `${publicUrl}?t=${Date.now()}`;

  // Update profiles.avatar_url — buat row bila belum ada
  const { data: updated, error: updErr } = await service
    .from('profiles')
    .update({ avatar_url: finalUrl })
    .eq('id', user.id)
    .select('id, email, full_name, role, phone, avatar_url, is_verified, created_at')
    .maybeSingle();

  let profile = updated as Record<string, unknown> | null;

  if (!profile && !updErr) {
    const { data: inserted, error: insErr } = await service
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email ?? '',
        avatar_url: finalUrl,
      } as Record<string, unknown>)
      .select('id, email, full_name, role, phone, avatar_url, is_verified, created_at')
      .maybeSingle();
    if (insErr) {
      console.error('[profile/avatar] insert profiles error', insErr.message);
      return NextResponse.json({ error: 'Gagal menyimpan ke profil.' }, { status: 500 });
    }
    profile = inserted as Record<string, unknown> | null;
  } else if (updErr) {
    console.error('[profile/avatar] update profiles error', updErr.message);
    return NextResponse.json({ error: 'Gagal menyimpan ke profil.' }, { status: 500 });
  }

  // Sinkron ke auth metadata (fallback — profiles tetap sumber utama)
  try {
    await service.auth.admin.updateUserById(user.id, {
      user_metadata: { avatar_url: finalUrl },
    });
  } catch (e) {
    console.error('[profile/avatar] metadata sync error', e);
  }

  return NextResponse.json({ publicUrl: finalUrl, profile });
}
