import { data } from 'react-router-dom';
import api from './api';

export const clientService = {
    getAll: async (filters) => {
        const res = await api.get('/clients',{
            params: filters
        });
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

    registerClient: async (data) => {
        const res = await api.post('/auth/register', data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.patch(`/clients/${id}`, data);
        return res.data;    
    },

    toggleActive: async (id, activo) => {
        (await api.patch(`/clients/${id}/toggle-active`, { activo })).data;
    },

    remove: async (id) => {
        const res = await api.delete(`/clients/${id}`);
        return res.data;
    }
}