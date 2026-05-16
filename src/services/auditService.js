import api from './api';

export const getAuditLogs = async () => {
    try {
        const response = await api.get('/audit');
        return response.data;
    } catch (error) {
        console.error("Error al obtener auditoría:", error);
        throw new Error("No se pudieron cargar los registros de auditoría");
    }
};