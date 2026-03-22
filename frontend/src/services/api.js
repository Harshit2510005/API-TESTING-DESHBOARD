import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API = axios.create({ baseURL: API_BASE_URL });

// हर रिक्वेस्ट के साथ टोकन भेजने के लिए इंटरसेप्टर
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// एक्सपोर्ट्स - यहाँ 'register' को जोड़ दिया गया है
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const testApiCall = (data) => API.post('/dashboard/test', data);
export const getHistory = () => API.get('/dashboard/history');
export const saveHistory = (data) => API.post('/history/add', data);
export const getUserHistory = () => API.get('/history/all');