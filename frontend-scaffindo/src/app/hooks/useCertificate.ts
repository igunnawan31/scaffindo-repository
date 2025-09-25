'use client'

import { useCallback, useEffect, useState } from "react";
import { Certificate,} from "../type/types";
import axios from "axios";

export function useCertificate() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCertificates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setCertificates([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/certifications?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let certificateData: Certificate[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                certificateData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                certificateData = res.data.data;
            } else if (Array.isArray(res.data?.certificates)) {
                console.log("res.data.certificates berhasil")
                certificateData = res.data.certificates;
            }

            setCertificates(certificateData);
            localStorage.setItem("certificate", JSON.stringify(certificateData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch certificates");
            setCertificates([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCertificateById = useCallback(async (id: string) => {
        try { 
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/certifications/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCertificate(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch certificate by ID");
            setCertificate(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCertificate = useCallback(async(id: string, updateData: Partial<Certificate> | FormData) => {
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

            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/certifications/${id}`, updateData,
                {
                    headers
                }
            );

            setCertificate(res.data);
            setCertificates((prev) =>
                prev.map((u) => (u.id === id ? res.data : u))
            );

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update certificate");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);
    
    const createCertificate= useCallback(async (createCertificateDTO: any) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                return;
            }

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/certifications`, createCertificateDTO,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create certificate");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCertificate = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/certifications/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Delete response:", res.data);
            setCertificates((prev) => prev.filter((u) => u.id !== id));

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete certificate");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        certificates,
        certificate,
        loading,
        error,
        fetchCertificates,
        fetchCertificateById,
        updateCertificate,
        createCertificate,
        deleteCertificate
    };
}