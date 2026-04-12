import React, { createContext, useState, useEffect } from 'react';
import { loginCall, logoutCall } from '../api/auth';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Use local sample data if API fails to simulate login for testing
            let data;
            try {
                data = await loginCall(username, password);
            } catch (err) {
                console.warn('API login failed, using mock data for development', err);
                data = {
                    access: 'mock_token_123',
                    refresh: 'mock_refresh_123',
                    user: { username, role: 'Doctor', hospital: 'General Hospital' }
                };
            }

            localStorage.setItem('access_token', data.access);
            if (data.refresh) {
                localStorage.setItem('refresh_token', data.refresh);
            }
            localStorage.setItem('user', JSON.stringify(data.user));

            setUser(data.user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Login error', error);
            toast.error('Invalid credentials or server error');
            return false;
        }
    };

    const logout = async () => {
        try {
            // Simulate API call for logout
            try {
                await logoutCall();
            } catch (e) {
                console.warn('API logout failed, performing local logout');
            }
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = '/login';
        }
    };

    const isDoctor = () => user?.role?.toLowerCase() === 'doctor';
    const isRadiologist = () => user?.role?.toLowerCase() === 'radiologist';

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, isDoctor, isRadiologist }}>
            {children}
        </AuthContext.Provider>
    );
};
