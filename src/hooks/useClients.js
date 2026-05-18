import { useEffect, useState } from "react";
import { clientService } from "../services/clientService";


export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        try {
            const data = await clientService.getAll()
            setClients(data.items || []);
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    };

    const createClient = async (data) => {
        await clientService.create(data);
        fetchClients();
    };

    const updateClient = async (id, data) => {
        await clientService.update(id, data);
        fetchClients();
    }

    const deleteClient = async (id) => {
        await clientService.remove(id)
        fetchClients();
    }

    const toggleClient = async (client) => {
        await clientService.toggleActive(client.id, !client.activo)
        fetchClients();
    }

    useEffect(() => {
        fetchClients();
    }, []);

    return { clients, loading, createClient, updateClient, deleteClient, toggleClient, };
}