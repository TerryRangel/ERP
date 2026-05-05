import api from './api';

export const getDashboardSummary = async () => {
    const res = await api.get('dashboard/summary');
    const raw = res.data;

    return {
        totalUsers: raw.totals?.users ?? 0,
        totalClients: raw.totals?.clients ?? 0,
        totalSuppliers: raw.totals?.suppliers ?? 0,
        totalProducts: raw.totals?.products ?? 0,

        lowStockProducts: raw.lowStockProducts ?? [],
        recepciones: raw.recepcionesRecientes ?? [],
        activity: raw.recentAudit ?? [],
    };
};
