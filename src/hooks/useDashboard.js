import { useEffect, useState, useCallback } from 'react';
import { getDashboardSummary } from '../services/dashboardService';

export const useDashboard = () => {
    const [data, setData] = useState({
        totalUsers: 0,
        totalClients: 0,
        totalSuppliers: 0,
        totalProducts: 0,
        lowStockProducts: [],
        recepciones: [],
        activity: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Envolvemos la función en useCallback para que no se re-cree en cada render
    const fetchDashboard = useCallback(async () => {
        setLoading(true); // Opcional: mostrar carga al recargar
        try{
            const result = await getDashboardSummary();
            setData(result);
            setError(null);
        } catch (err) {
            console.error(err)
            setError("Error al cargar el dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    } , [fetchDashboard]);

    // Retornamos 'refetch' para poder llamarlo manualmente desde el componente
    return { data, loading, error, refetch: fetchDashboard };
}