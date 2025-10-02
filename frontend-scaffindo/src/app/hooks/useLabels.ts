import { useState, useCallback } from "react";
import { Label } from "../type/types";
import axios from "axios";
import axiosInstance from "../lib/axiosInstance";

export function useLabels() {
    const [labels, setLabels] = useState<Label[]>([]);
    const [penjualan, setPenjualan] = useState<Label[]>([]);
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

            const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/labels`, {
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

    const fetchLabelsPenjualan = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setPenjualan([]);
                return;
            }

            const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/labels?status=ARRIVED_AT_RETAIL`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let penjualanData: Label[] = [];
            
            if (Array.isArray(res.data)) {
                penjualanData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                penjualanData = res.data.data;
            } else if (Array.isArray(res.data?.certificates)) {
                penjualanData = res.data.certificates;
            }

            setPenjualan(penjualanData);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch labels");
            setPenjualan([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLabelById = useCallback(async (id: string) => {
        try { 
            setLoading(true);
            setError(null);

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/labels/${id}`);
            setLabel(res.data);
            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch label by ID");
            setLabel(null);
            return null;
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

    const bulkBuy = useCallback(async (payload: { 
        title: string; 
        description: string; 
        paymentMethod: string; 
        labelIds: string[];
        status: string;
    }) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");

            if (!token) {
                setError("No authentication token found");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const formattedPayload = {
                ...payload,
                labelIds: payload.labelIds, 
            };

            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/labels/buy/bulk`,
                formattedPayload,
                { headers }
            );

            return res.data;
            
        } catch (err: any) {
            console.error("Bulk buy failed:", err.response || err);
            setError(err.response?.data?.message || "Failed to perform bulk buy");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        fetchLabels,
        fetchLabelsPenjualan,
        fetchLabelById, 
        updateLabel,
        bulkBuy,
        labels, 
        label,
        penjualan,
        loading, 
        error 
    };
}