import { get, post, del } from './client';

export const fetchTestimonials = () => get('/api/testimonials', { auth: false });
export const createTestimonial = (payload) => post('/api/testimonials', payload);
export const deleteTestimonial = (id) => del(`/api/testimonials/${id}`);