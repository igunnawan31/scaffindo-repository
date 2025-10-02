import { useState, useCallback } from "react";
import { Penjualan } from "../type/types";
import axios from "axios";
import axiosInstance from "../lib/axiosInstance";

export function usePenjualan() {
    const [histories, setHistories] = useState<Penjualan[]>([]);
    const [history, setHistory] = useState<Penjualan | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setHistories([]);
                return;
            }

            const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/penjualan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let historyData: Penjualan[] = [];
            
            if (Array.isArray(res.data)) {
                historyData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                historyData = res.data.data;
            }

            setHistories(historyData);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch labels");
            setHistories([]);
        } finally {
            setLoading(false);
        }
    }, []);
    
    return {
        fetchHistories,
        histories
    }
}