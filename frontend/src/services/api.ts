const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const BASE = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

let csrfTokenCache = '';
let warmupInFlight: Promise<void> | null = null;

async function ensureCsrfToken(forceRefresh = false): Promise<string> {
  if (forceRefresh) csrfTokenCache = '';
  if (csrfTokenCache) return csrfTokenCache;
  const res = await fetch(`${BASE}/auth/csrf/`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to initialize CSRF token');
  const data = await res.json();
  csrfTokenCache = data.csrfToken || '';
  return csrfTokenCache;
}

function isSafeMethod(method: string): boolean {
  return ['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method);
}

function looksLikeCsrfError(status: number, body: any): boolean {
  if (status !== 403) return false;
  const detail = String(body?.detail || '').toLowerCase();
  return detail.includes('csrf');
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...rest } = options || {};
  const method = (rest.method || 'GET').toUpperCase();

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((extraHeaders as Record<string, string>) || {}),
  };

  const send = async (forceCsrfRefresh = false) => {
    const headers: Record<string, string> = { ...baseHeaders };
    if (!isSafeMethod(method) && !headers['X-CSRFToken']) {
      headers['X-CSRFToken'] = await ensureCsrfToken(forceCsrfRefresh);
    }

    return fetch(url, {
      credentials: 'include',
      ...rest,
      headers,
    });
  };

  let res = await send(false);

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    let body = await res.json().catch(() => ({}));

    // CSRF tokens can rotate on auth/session changes; retry once with a fresh token.
    if (!isSafeMethod(method) && looksLikeCsrfError(res.status, body)) {
      res = await send(true);
      if (res.status === 204) return undefined as T;
      if (res.ok) return res.json();
      body = await res.json().catch(() => ({}));
    }

    throw { status: res.status, ...body };
  }
  return res.json();
}

// ─── Auth ────────────────────────────
export const auth = {
  warmup: async () => {
    if (warmupInFlight) return warmupInFlight;

    warmupInFlight = fetch(`${BASE}/auth/csrf/`, {
      credentials: 'include',
      keepalive: true,
    })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        warmupInFlight = null;
      });

    return warmupInFlight;
  },
  login: async (data: { username: string; password: string }) => {
    const response = await request(`${BASE}/auth/login/`, { method: 'POST', body: JSON.stringify(data) });
    csrfTokenCache = '';
    return response;
  },
  googleLogin: async (credential: string) => {
    const response = await request(`${BASE}/auth/google/`, { method: 'POST', body: JSON.stringify({ credential }) });
    csrfTokenCache = '';
    return response;
  },
  register: (data: { username: string; email: string; password: string; password2: string }) =>
    request(`${BASE}/auth/register/`, { method: 'POST', body: JSON.stringify(data) }),
  logout: async () => {
    const response = await request(`${BASE}/auth/logout/`, { method: 'POST' });
    csrfTokenCache = '';
    return response;
  },
  me: () =>
    request<{ id: number; username: string; email: string; display_name?: string; avatar_url?: string | null }>(`${BASE}/auth/me/`),
};

// ─── Generic CRUD helpers ────────────
function crud<T>(path: string) {
  return {
    list: () => request<T[]>(`${BASE}/${path}/`),
    get: (id: string | number) => request<T>(`${BASE}/${path}/${id}/`),
    create: (data: Partial<T>) =>
      request<T>(`${BASE}/${path}/`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: Partial<T>) =>
      request<T>(`${BASE}/${path}/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (id: string | number, data: Partial<T>) =>
      request<T>(`${BASE}/${path}/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string | number) =>
      request<void>(`${BASE}/${path}/${id}/`, { method: 'DELETE' }),
  };
}

function nestedCrud<T>(parentPath: string, childPath: string) {
  return {
    list: (parentId: string | number) =>
      request<T[]>(`${BASE}/${parentPath}/${parentId}/${childPath}/`),
    get: (parentId: string | number, id: string | number) =>
      request<T>(`${BASE}/${parentPath}/${parentId}/${childPath}/${id}/`),
    create: (parentId: string | number, data: Partial<T>) =>
      request<T>(`${BASE}/${parentPath}/${parentId}/${childPath}/`, {
        method: 'POST', body: JSON.stringify(data),
      }),
    update: (parentId: string | number, id: string | number, data: Partial<T>) =>
      request<T>(`${BASE}/${parentPath}/${parentId}/${childPath}/${id}/`, {
        method: 'PUT', body: JSON.stringify(data),
      }),
    delete: (parentId: string | number, id: string | number) =>
      request<void>(`${BASE}/${parentPath}/${parentId}/${childPath}/${id}/`, {
        method: 'DELETE',
      }),
  };
}

// ─── Resource APIs ───────────────────
import type {
  Employee, Crop, CropExpense, CropSale, CropOperation,
  Machinery as TMachinery, MachineryActivity, MachineryMaintenance,
  Livestock as TLivestock, LivestockProduction,
  MilkProduction, EggProduction, ProductionSummary,
} from '../types';

export const employees = crud<Employee>('employees');
export const crops = crud<Crop>('crops');
export const cropExpenses = nestedCrud<CropExpense>('crops', 'expenses');
export const cropSales = nestedCrud<CropSale>('crops', 'sales');
export const cropOperations = nestedCrud<CropOperation>('crops', 'operations');

export const machinery = crud<TMachinery>('machinery');
export const machineryActivities = nestedCrud<MachineryActivity>('machinery', 'activities');
export const machineryMaintenance = nestedCrud<MachineryMaintenance>('machinery', 'maintenance');

export const livestock = crud<TLivestock>('livestock');
export const livestockProduction = nestedCrud<LivestockProduction>('livestock', 'production');

export const milkProduction = {
  ...crud<MilkProduction>('milk-production'),
  listFiltered: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.set('year', String(year));
    if (month) params.set('month', String(month));
    return request<MilkProduction[]>(`${BASE}/milk-production/?${params}`);
  },
  summary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.set('year', String(year));
    if (month) params.set('month', String(month));
    return request<ProductionSummary>(`${BASE}/milk-production/summary/?${params}`);
  },
};

export const eggProduction = {
  ...crud<EggProduction>('egg-production'),
  listFiltered: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.set('year', String(year));
    if (month) params.set('month', String(month));
    return request<EggProduction[]>(`${BASE}/egg-production/?${params}`);
  },
  summary: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.set('year', String(year));
    if (month) params.set('month', String(month));
    return request<ProductionSummary>(`${BASE}/egg-production/summary/?${params}`);
  },
};
