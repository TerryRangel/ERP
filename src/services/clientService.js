import { data } from 'react-router-dom';
import api from './api';

export const clientService = {
    getAll: async () => {
        const res = await api.get('/clients');
        return res.data;
    },

    getById: async (id) => {
        const res = await api.get(`/clients/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await api.post('/clients', data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.patch(`/clients/${id}`, data);
        return res.data;    
    },

    toogleActive: async (id) => {
        const res = await api.patch(`/clients/${id}/toggle-active`);
        return res.data;
    },

    remove: async (id) => {
        const res = await api.delete(`/clients/${id}`);
        return res.data;
    }
}