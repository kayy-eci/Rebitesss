
"use client";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

interface MockUser {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  created_at: string;
}

interface MockSession {
  user: MockUser;
  access_token: string;
}

const MOCK_USERS_KEY = "rebites_mock_users";
const MOCK_SESSION_KEY = "rebites_mock_session";
const MOCK_UMKM_KEY = "rebites_mock_umkm";

function getStoredUsers(): Record<string, { password: string; user: MockUser }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function setStoredUsers(users: Record<string, { password: string; user: MockUser }>) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function createMockSession(user: MockUser): MockSession {
  return {
    user,
    access_token: "mock_token_" + generateId(),
  };
}

function setSession(session: MockSession | null) {
  if (session) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
}

function getSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const mockAuth = {
  async getSession() {
    await delay(100);
    const session = getSession();
    return { data: { session }, error: null };
  },

  async signUp({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options?: { data?: Record<string, any> };
  }) {
    await delay(400);
    const users = getStoredUsers();

    if (users[email]) {
      return { data: { user: null, session: null }, error: { message: "User already registered" } };
    }

    const user: MockUser = {
      id: generateId(),
      email,
      user_metadata: options?.data || {},
      created_at: new Date().toISOString(),
    };

    users[email] = { password, user };
    setStoredUsers(users);

    const session = createMockSession(user);
    setSession(session);

    return { data: { user, session }, error: null };
  },

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    await delay(400);
    const users = getStoredUsers();
    const stored = users[email];

    if (!stored || stored.password !== password) {
      return { data: { user: null, session: null }, error: { message: "Invalid login credentials" } };
    }

    const session = createMockSession(stored.user);
    setSession(session);

    return { data: { user: stored.user, session }, error: null };
  },

  async signOut() {
    await delay(100);
    setSession(null);
    return { error: null };
  },
};

function createMockQueryBuilder(table: string) {
  let _data: any = null;
  let _filter: { column: string; value: any } | null = null;

  const builder: any = {
    insert(data: any) {
      _data = data;
      return builder;
    },
    select(_cols?: string) {
      return builder;
    },
    eq(column: string, value: any) {
      _filter = { column, value };
      return builder;
    },
    single() {
      return builder;
    },
    async then(resolve: any) {
      await delay(200);

      if (table === "umkm_profiles" && _data) {
        const stored = JSON.parse(localStorage.getItem(MOCK_UMKM_KEY) || "[]");
        const row = {
          id: generateId(),
          ..._data,
          is_verified: false,
          rating: 5.0,
          created_at: new Date().toISOString(),
        };
        stored.push(row);
        localStorage.setItem(MOCK_UMKM_KEY, JSON.stringify(stored));
        return resolve({ data: row, error: null });
      }

      if (_filter) {
        const stored = JSON.parse(localStorage.getItem(MOCK_UMKM_KEY) || "[]");
        const match = stored.find((r: any) => r[_filter!.column] === _filter!.value);
        return resolve({ data: match || null, error: null });
      }

      return resolve({ data: _data, error: null });
    },
  };

  return builder;
}

function createMockStorageFrom(bucket: string) {
  return {
    upload(path: string, file: File | Blob, _opts?: any) {
      return {
        then(resolve: any) {
          delay(200).then(() => {
            const reader = new FileReader();
            reader.onload = () => {
              const key = `mock_storage_${bucket}_${path}`;
              localStorage.setItem(key, reader.result as string);
              resolve({ data: { path }, error: null });
            };
            reader.readAsDataURL(file);
          });
        },
      };
    },

    getPublicUrl(path: string) {
      const key = `mock_storage_${bucket}_${path}`;
      const dataUrl = localStorage.getItem(key);
      return {
        data: {
          publicUrl: dataUrl || `https://placehold.co/200x200?text=${encodeURIComponent(path)}`,
        },
      };
    },
  };
}

const mockFrom = (table: string) => ({
  ...createMockQueryBuilder(table),
});

const mockStorage = {
  from: (bucket: string) => createMockStorageFrom(bucket),
};

export const supabase = {
  auth: mockAuth,
  from: mockFrom,
  storage: mockStorage,
} as any;
