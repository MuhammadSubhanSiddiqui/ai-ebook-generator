import { get, post, put, del } from './client';

export const fetchEbooks = () => get('/api/ebooks');
export const fetchEbook = (id) => get(`/api/ebooks/${id}`);
export const createEbook = (payload) => post('/api/ebooks', payload);
export const updateEbook = (id, payload) => put(`/api/ebooks/${id}`, payload);
export const deleteEbook = (id) => del(`/api/ebooks/${id}`);