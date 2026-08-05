import { post } from './client';

export const login = (email, password) =>
  post('/api/users/login', { email, password }, { auth: false });

export const register = (name, email, password) =>
  post('/api/users', { name, email, password }, { auth: false });