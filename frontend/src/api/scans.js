import api from './axios';

export const getScans = async () => {
    const response = await api.get('/api/scans/');
    return response.data;
};

export const uploadScan = async (formData) => {
    const response = await api.post('/api/scans/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getScanResult = async (id) => {
    const response = await api.get(`/api/scans/${id}/`);
    return response.data;
};

export const getPatientScans = async (patientId) => {
    const response = await api.get(`/api/scans/patient/${patientId}/`);
    return response.data;
};
