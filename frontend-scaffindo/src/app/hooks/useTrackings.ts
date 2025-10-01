import { useState, useCallback } from "react";
import { Tracking } from "../type/types";
import axios from "axios";
import axiosInstance from "../lib/axiosInstance";

export function useTrackings() {
    const [tracking, setTracking] = useState<Tracking | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTrackingById = useCallback(async (labelId: string) => {
        try { 
            setLoading(true);
            setError(null);

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trackings/${labelId}`);

            const data = Array.isArray(res.data) ? res.data : [];
            return data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch tracking by ID");
            setTracking(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        fetchTrackingById,
        tracking, 
        loading, 
        error 
    };
}