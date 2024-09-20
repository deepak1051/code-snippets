import axios from 'axios';
import jwtDecode from 'jwt-decode';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('accessToken');

  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      // Token expired, request a new one
      const { data } = await axios.post(
        '/auth/token',
        {},
        { withCredentials: true }
      );
      token = data.accessToken;
      localStorage.setItem('accessToken', token);
    }

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
