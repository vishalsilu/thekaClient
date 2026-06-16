import api from '../src/config/api';

export const registerUser = async (userData) => {
    // userData = { name, email, password }
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    // credentials = { email, password }
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const logoutUser = async () => {
    await api.post('/auth/logout');
};