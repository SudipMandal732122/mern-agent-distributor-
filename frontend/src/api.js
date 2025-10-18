import axios from 'axios';

// Use Vite env variable
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const client = axios.create({
  baseURL: BASE,
});

client.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
