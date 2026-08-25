"use client";

/**
 * Mock client Supabase untuk mode data 'local' (lihat lib/data-source.ts).
 * Dipulihkan dari implementasi lama sebelum integrasi Supabase, lalu
 * diperluas agar modul-modul yang masih memanggil `supabase` secara langsung
 * (notifikasi, alamat, review, langganan, dsb.) tetap berjalan tanpa error:
 * semua tabel disimpan generik di localStorage per tabel.
 *
 * Client asli Supabase TIDAK diubah — file ini hanya dipakai ketika
 * DATA_SOURCE = 'local', atau 'auto' tanpa env var.
 */

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
const tableKey = (table: string) => `rebites_mock_table_${table}`;

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

// ---- penyimpanan tabel generik ----

function readTable(table: string): Record<string, any>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(tableKey(table));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTable(table: string, rows: Record<string, any>[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(tableKey(table), JSON.stringify(rows));
  window.dispatchEvent(new Event(`rebites-mock-table-${table}`));
}

type Filter =
  | { type: "eq" | "neq"; column: string; value: any }
  | { type: "is"; column: string; value: any }
  | { type: "in"; column: string; values: any[] }
  | { type: "not"; column: string; op: string; value: any };

function rowMatches(row: Record<string, any>, filters: Filter[]): boolean {
  return filters.every((f) => {
    switch (f.type) {
      case "eq":
        return row[f.column] === f.value;
      case "neq":
        return row[f.column] !== f.value;
      case "is":
        return f.value === null ? row[f.column] == null : row[f.column] === f.value;
      case "in":
        return f.values.includes(row[f.column]);
      case "not": {
        const target = row[f.column];
        if (f.op === "eq") return target !== f.value;
        if (f.op === "is") return f.value === null ? target != null : target !== f.value;
        return true;
      }
      default:
        return true;
    }
  });
}

function createMockQueryBuilder(table: string) {
  let pendingInsert: Record<string, any> | Record<string, any>[] | null = null;
  let pendingUpdate: Record<string, any> | null = null;
  let pendingUpsert: Record<string, any> | Record<string, any>[] | null = null;
  let deleteMode = false;
  const filters: Filter[] = [];
  let orderColumn: string | null = null;
  let orderAscending = true;
  let limitCount: number | null = null;

  const normalizeRows = (
    data: Record<string, any> | Record<string, any>[]
  ): Record<string, any>[] =>
    (Array.isArray(data) ? data : [data]).map((row) => ({
      id: row.id ?? generateId(),
      created_at: row.created_at ?? new Date().toISOString(),
      ...row,
    }));

  const builder: any = {
    insert(data: any) {
      pendingInsert = data;
      return builder;
    },
    upsert(data: any, _opts?: any) {
      pendingUpsert = data;
      return builder;
    },
    update(patch: Record<string, any>) {
      pendingUpdate = patch;
      return builder;
    },
    delete() {
      deleteMode = true;
      return builder;
    },
    select(_cols?: string) {
      return builder;
    },
    eq(column: string, value: any) {
      filters.push({ type: "eq", column, value });
      return builder;
    },
    neq(column: string, value: any) {
      filters.push({ type: "neq", column, value });
      return builder;
    },
    is(column: string, value: any) {
      filters.push({ type: "is", column, value });
      return builder;
    },
    not(column: string, op: string, value: any) {
      filters.push({ type: "not", column, op, value });
      return builder;
    },
    in(column: string, values: any[]) {
      filters.push({ type: "in", column, values });
      return builder;
    },
    order(column: string, opts?: { ascending?: boolean }) {
      orderColumn = column;
      orderAscending = opts?.ascending !== false;
      return builder;
    },
    limit(n: number) {
      limitCount = n;
      return builder;
    },
    range(_from: number, _to: number) {
      return builder;
    },
    single() {
      return builder;
    },
    maybeSingle() {
      return builder;
    },

    // eksekusi saat di-await / .then()
    async then(onFulfilled?: (result: any) => any) {
      await delay(150);
      const result = await builder._exec();
      return onFulfilled ? onFulfilled(result) : result;
    },
    async _exec() {
      const rows = readTable(table);

      if (pendingInsert != null || pendingUpsert != null) {
        const incoming = normalizeRows(
          (pendingInsert ?? pendingUpsert) as Record<string, any> | Record<string, any>[]
        );
        let stored = rows;
        if (pendingUpsert != null) {
          for (const row of incoming) {
            stored = stored.filter((r) => r.id !== row.id);
          }
        }
        stored = [...incoming, ...stored];
        writeTable(table, stored);
        const written = incoming.map((row) => ({ ...row }));
        return { data: written, error: null };
      }

      if (pendingUpdate != null) {
        let changed = false;
        const next = rows.map((row) => {
          if (!rowMatches(row, filters)) return row;
          changed = true;
          return { ...row, ...pendingUpdate };
        });
        if (changed) writeTable(table, next);
        const updated = next
          .filter((row) => rowMatches(row, filters))
          .map((row) => ({ ...row }));
        return { data: updated.length > 0 ? updated : null, error: null };
      }

      if (deleteMode) {
        const kept = rows.filter((row) => !rowMatches(row, filters));
        if (kept.length !== rows.length) writeTable(table, kept);
        return { data: [], error: null };
      }

      let matched = rows.filter((row) => rowMatches(row, filters));
      if (orderColumn) {
        matched = [...matched].sort((a, b) => {
          const av = a[orderColumn as string];
          const bv = b[orderColumn as string];
          const cmp =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av ?? "").localeCompare(String(bv ?? ""));
          return orderAscending ? cmp : -cmp;
        });
      }
      if (limitCount != null) matched = matched.slice(0, limitCount);
      return { data: matched.map((row) => ({ ...row })), error: null };
    },
  };

  return builder;
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
      return {
        data: { user: null, session: null },
        error: { message: "User already registered" },
      };
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

  async signInWithPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    await delay(400);
    const users = getStoredUsers();
    const stored = users[email];

    if (!stored || stored.password !== password) {
      return {
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" },
      };
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

  async resetPasswordForEmail(_email: string) {
    // Mode lokal: tidak ada email nyata yang dikirim.
    await delay(300);
    return { data: {}, error: null };
  },

  onAuthStateChange(
    _callback: (event: string, session: MockSession | null) => void
  ) {
    return {
      data: {
        subscription: {
          unsubscribe() {},
        },
      },
    };
  },
};

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
          publicUrl:
            dataUrl ||
            `https://placehold.co/200x200?text=${encodeURIComponent(path)}`,
        },
      };
    },
  };
}

const mockFrom = (table: string) => createMockQueryBuilder(table);

const mockStorage = {
  from: (bucket: string) => createMockStorageFrom(bucket),
};

const mockRpc = async (fn: string, _args?: Record<string, unknown>) => {
  await delay(120);
  // reserve_stock tidak relevan pada mode lokal — stok divalidasi di UI.
  if (fn === "reserve_stock") return { data: true, error: null };
  return { data: null, error: null };
};

const mockRealtime = {
  channel(_name: string) {
    const self: any = {
      on() {
        return self;
      },
      subscribe() {
        return self;
      },
    };
    return self;
  },
  removeChannel(_channel: unknown) {},
};

export const supabase = {
  auth: mockAuth,
  from: mockFrom,
  storage: mockStorage,
  rpc: mockRpc,
  channel: mockRealtime.channel,
  removeChannel: mockRealtime.removeChannel,
} as unknown as import("@supabase/supabase-js").SupabaseClient;
