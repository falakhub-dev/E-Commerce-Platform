import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: false
});

// attach access token (from localStorage)
http.interceptors.request.use(cfg => {
  const token = localStorage.getItem('accessToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default http;
