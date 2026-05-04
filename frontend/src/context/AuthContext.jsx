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
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const data = await loginCall(username, password);

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
            const errorMsg = error.response?.data?.error || 'Invalid credentials or server error';
            toast.error(errorMsg);
            return false;
        }
    };

    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            if (refresh) {
                await logoutCall(refresh);
            }
        } catch (e) {
            console.warn('API logout failed, performing local logout');
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
