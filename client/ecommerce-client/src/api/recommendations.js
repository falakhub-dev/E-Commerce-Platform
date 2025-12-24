import http from './http';
export const homeFeed = () => http.get('/recommendations/home');
export const logEvent = (productId, type) => http.post('/recommendations/events', { productId, type });
