import { useEffect, useState } from "react";
import { clientService } from "../services/clientService";


export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fecthClients = async () => {
        try {
            const data = await clientService.getAll()
            setClients(data)
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fecthClients();
    }, []);

    return { clients, loading, fecthClients, };
}