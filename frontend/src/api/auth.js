import api from './axios';

export const loginCall = async (username, password) => {
    const response = await api.post('/api/auth/login/', { username, password });
    return response.data;
};

export const registerCall = async (userData) => {
    const response = await api.post('/api/auth/register/', userData);
    return response.data;
};

export const logoutCall = async () => {
    const response = await api.post('/api/auth/logout/');
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get('/api/auth/profile/');
    return response.data;
};
