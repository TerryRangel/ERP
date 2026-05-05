import {useEffect, useState} from 'react';
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

    useEffect(() => {
        const fetchDashboard = async () => {
            try{
                const result = await getDashboardSummary();
                setData(result);
            } catch (err) {
                console.error(err)
                setError("Error al cargar el dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    } , []);


    return { data, loading, error };
}