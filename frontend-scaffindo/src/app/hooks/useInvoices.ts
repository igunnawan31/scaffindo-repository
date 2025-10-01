import { useState, useCallback } from "react";
import { Invoice } from "../type/types";
import axios from "axios";
import axiosInstance from "../lib/axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useInvoice() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createInvoice = useCallback(async (createInvoiceDTO: any) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setInvoices([]);
                return;
            }

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, createInvoiceDTO,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return res.data
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create product");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchInvoices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setInvoices([]);
                return;
            }

            const res = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/invoices?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let invoiceData: Invoice[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                invoiceData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                invoiceData = res.data.data;
            } else if (Array.isArray(res.data?.certificates)) {
                console.log("res.data.certificates berhasil")
                invoiceData = res.data.certificates;
            }

            setInvoices(invoiceData);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch invoices");
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchInvoiceById = useCallback(async (id: string) => {
        try { 
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axiosInstance.get(
                `${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInvoice(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch invoice by ID");
            setInvoice(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateInvoice = useCallback(async (id: string, updateData: Partial<Invoice> | FormData) => {
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

            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}`, updateData,
                { headers }
            );

            setInvoice(res.data);
            setInvoices((prev) =>
                prev.map((u) => (u.id === id ? res.data : u))
            );

            return res.data;
        } catch (err: any) {
            console.error("Update invoice failed:", err.response || err);
            setError(err.response?.data?.message || "Failed to invoice product");
            throw err;
        } finally {
            setLoading(false);
        }
    },[]);

    return { 
        createInvoice, 
        fetchInvoices, 
        fetchInvoiceById, 
        updateInvoice,
        invoices, 
        invoice, 
        loading, 
        error 
    };
}