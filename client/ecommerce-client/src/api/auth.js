import http from './http';

export const register = (data) => http.post('/auth/register', data);
export const login = (data) => http.post('/auth/login', data);
export const refresh = (refreshToken) => http.post('/auth/refresh', { refreshToken });
export const me = () => http.get('/auth/me');
export const logout = (refreshToken) => http.post('/auth/logout', { refreshToken });
