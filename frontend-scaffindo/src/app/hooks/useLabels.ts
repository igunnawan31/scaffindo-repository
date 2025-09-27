import { useState, useCallback } from "react";
import { Label } from "../type/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useLabels() {
    const [labels, setLabels] = useState<Label[]>([]);
    const [label, setLabel] = useState<Label | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLabels = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setLabels([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/labels?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let labelData: Label[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                labelData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                labelData = res.data.data;
            } else if (Array.isArray(res.data?.certificates)) {
                console.log("res.data.certificates berhasil")
                labelData = res.data.certificates;
            }

            setLabels(labelData);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch labels");
            setLabels([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLabelById = useCallback(async (id: string) => {
        try { 
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/labels/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLabel(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch label by ID");
            setLabel(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateLabel = useCallback(async (id: string, updateData: Partial<Label> | FormData) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");

            if (!token) {
                setError("No authentication token found");
                return;
            }

            const headers: any = {
                Authorization: `Bearer ${token}`,
            };

            if (!(updateData instanceof FormData)) {
                headers["Content-Type"] = "application/json";
            }

            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/labels/${id}`, updateData,
                { headers }
            );

            setLabel(res.data);
            setLabels((prev) =>
                prev.map((u) => (u.id === id ? res.data : u))
            );

            return res.data;
        } catch (err: any) {
            console.error("Update product failed:", err.response || err);
            setError(err.response?.data?.message || "Failed to update product");
            throw err;
        } finally {
            setLoading(false);
        }
    },[]);

    return { 
        fetchLabels, 
        fetchLabelById, 
        updateLabel,
        labels, 
        label, 
        loading, 
        error 
    };
}