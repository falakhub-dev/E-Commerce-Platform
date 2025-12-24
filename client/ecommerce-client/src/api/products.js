import http from './http';
export const listProducts = (params) => http.get('/products', { params });
export const productDetailBySlug = (slug) => http.get(`/products/${slug}`);
export const similarForProduct = (id) => http.get(`/recommendations/product/${id}`);
