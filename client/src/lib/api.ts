import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Intercepteur: ajouter le token JWT ──────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Intercepteur: refresh token automatique ─────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── API Functions ───────────────────────────────────────
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { email: string; password: string; name: string }) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const projectAPI = {
  list: () => api.get('/projects'),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  duplicate: (id: string) => api.post(`/projects/${id}/duplicate`),
  favorite: (id: string) => api.post(`/projects/${id}/favorite`),
  restore: (id: string, versionId: string) => api.post(`/projects/${id}/restore/${versionId}`),
  addCollaborator: (id: string, data: any) => api.post(`/projects/${id}/collaborators`, data),
  addComment: (id: string, data: any) => api.post(`/projects/${id}/comments`, data),
};

export const aiAPI = {
  generatePlans: (data: any) => api.post('/ai/generate-plans', data),
  modifyPlan: (data: any) => api.post('/ai/modify-plan', data),
  chat: (data: any) => api.post('/ai/chat', data),
};

export const estimateAPI = {
  materials: (data: any) => api.post('/estimates/materials', data),
  budget: (data: any) => api.post('/estimates/budget', data),
};

export const exportAPI = {
  download: (format: string, data: any) => api.post(`/exports/${format}`, data, { responseType: 'blob' }),
};

export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: (page?: number) => api.get(`/admin/users?page=${page || 1}`),
  updateUser: (id: string, data: any) => api.patch(`/admin/users/${id}`, data),
  activities: (page?: number) => api.get(`/admin/activities?page=${page || 1}`),
};
