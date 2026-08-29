'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const PROFILE_UPDATED_EVENT = 'rebites-profile-updated';

export interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshIdx, setRefreshIdx] = useState(0);

  const refresh = useCallback(() => setRefreshIdx((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          if (!cancelled) {
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        const metaName = (user.user_metadata as Record<string, unknown> | null)?.full_name as string | undefined;
        const metaAvatar = (user.user_metadata as Record<string, unknown> | null)?.avatar_url as string | undefined;
        const email = user.email ?? '';
        const fallbackName = metaName?.trim() || email.split('@')[0] || 'Pengguna ReBites';

        let avatarUrl: string | null = null;
        let fullNameFromDb: string | null = null;
        try {
          const { data: row, error } = await supabase
            .from('profiles')
            .select('avatar_url, full_name')
            .eq('id', user.id)
            .maybeSingle();
          if (!error && row) {
            avatarUrl = (row as { avatar_url: string | null }).avatar_url ?? null;
            fullNameFromDb = (row as { full_name: string | null }).full_name ?? null;
          }
        } catch {
          
        }

        const finalAvatar = avatarUrl || metaAvatar || null;
        const finalName = fullNameFromDb?.trim() || fallbackName;

        if (!cancelled) {
          setProfile({
            id: user.id,
            fullName: finalName,
            email,
            avatarUrl: finalAvatar,
          });
        }
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    const onProfileUpdated = () => fetchProfile();
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      window.removeEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
    };
  }, [refreshIdx]);

  return {
    profile,
    userId: profile?.id ?? null,
    fullName: profile?.fullName ?? '',
    email: profile?.email ?? '',
    avatarUrl: profile?.avatarUrl ?? null,
    initials: profile?.fullName ? getInitials(profile.fullName) : '',
    loading,
    refresh,
  };
}

export async function uploadAvatar(file: File): Promise<{ publicUrl: string | null; error: string | null }> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const uid = session?.user.id;
  if (!uid) return { publicUrl: null, error: 'Sesi tidak ditemukan, silakan login ulang.' };

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    return { publicUrl: null, error: 'Format file harus JPG, JPEG, PNG, atau WebP.' };
  }
  const maxBytes = 2 * 1024 * 1024; 
  if (file.size > maxBytes) {
    return { publicUrl: null, error: 'Ukuran file maksimal 2MB.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || (file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg');
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const path = `${uid}/avatar.${safeExt}`;

  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  });

  if (uploadError) {
    return { publicUrl: null, error: uploadError.message || 'Gagal upload foto.' };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(path);

  const bustedUrl = publicUrl ? `${publicUrl}?t=${Date.now()}` : null;

  let dbError: { message: string } | null = null;
  const { error: updErr } = await supabase.from('profiles').update({ avatar_url: bustedUrl ?? publicUrl }).eq('id', uid);
  if (updErr) dbError = updErr;
  else {
    
    const { data: check } = await supabase.from('profiles').select('id').eq('id', uid).maybeSingle();
    if (!check) {
      const { error: insErr } = await supabase.from('profiles').insert({
        id: uid,
        email: session.user.email ?? '',
        avatar_url: bustedUrl ?? publicUrl,
      } as never);
      if (insErr) dbError = insErr;
      else dbError = null;
    }
  }
  if (dbError) {
    return { publicUrl: null, error: dbError.message || 'Gagal menyimpan ke profil.' };
  }

  try {
    await supabase.auth.updateUser({ data: { avatar_url: bustedUrl ?? publicUrl } });
  } catch {
    
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  }

  return { publicUrl: bustedUrl ?? publicUrl, error: null };
}
