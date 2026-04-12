import api from './axios';

export const generateReport = async (scanId) => {
    const response = await api.post('/api/reports/generate/', { scan_id: scanId });
    return response.data;
};

export const getReport = async (id) => {
    const response = await api.get(`/api/reports/${id}/`);
    return response.data;
};

export const getReports = async () => {
    const response = await api.get('/api/reports/');
    return response.data;
};
