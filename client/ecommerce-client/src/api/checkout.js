import http from './http';
export const createIntent = () => http.post('/checkout/create-intent');
export const confirmOrder = (orderId) => http.post('/checkout/confirm', { orderId });
