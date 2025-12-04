import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add tenant ID header
api.interceptors.request.use((config) => {
  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') : null;
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }
  return config;
});

export interface Stats {
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export interface Trend {
  date: string;
  orders: number;
  revenue: number;
}

export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  totalSpent: number;
}

export interface TenantData {
  name: string;
  shopifyDomain: string;
  accessToken: string;
  email: string;
}

export interface Tenant {
  id: string;
  name: string;
  shopifyDomain: string;
  email: string | null;
}

export const login = async (tenantId: string) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/stats`, {
      headers: { 'x-tenant-id': tenantId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchStats = async (): Promise<Stats> => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const fetchTrends = async (): Promise<Trend[]> => {
  const response = await api.get('/dashboard/orders-trend');
  return response.data;
};

export const fetchTopCustomers = async (): Promise<Customer[]> => {
  const response = await api.get('/dashboard/top-customers');
  return response.data;
};

export const triggerSync = async () => {
  const response = await api.post('/ingest/sync');
  return response.data;
};

export const onboardTenant = async (data: TenantData): Promise<Tenant> => {
  const response = await api.post('/tenants/onboard', data);
  return response.data;
};

export default api;
