'use client'

import { useCallback, useEffect, useState } from "react";
import { Company } from "../type/types";
import axios from "axios";

export function useCompany() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [company, setCompany] = useState<Company | null>(null);
    const [distributors, setDistributors] = useState<Company[]>([]);
    const [agents, setAgents] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setCompanies([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let companyData: Company[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                companyData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                companyData = res.data.data;
            } else if (Array.isArray(res.data?.companies)) {
                console.log("res.data.companies berhasil")
                companyData = res.data.companies;
            }

            setCompanies(companyData);
            localStorage.setItem("companies", JSON.stringify(companyData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch companies");
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCompanyById = useCallback(async (id: string) => {
        try { 
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/companies/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCompany(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch company by ID");
            setCompany(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCompany = useCallback(async(id: string, updateData: Partial<Company>) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${id}`, updateData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCompany(res.data);
            setCompanies((prev) =>
                prev.map((u) => (u.id === id ? res.data : u))
            );

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update company");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);
    
    const createCompany = useCallback(async (createCompanyDTO: any) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                return;
            }

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/companies`, createCompanyDTO,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create company");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCompany = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/companies/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Delete response:", res.data);
            setCompanies((prev) => prev.filter((u) => u.id !== id));

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete company");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDistributors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setDistributors([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies?companyType=DISTRIBUTOR&limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let companyData: Company[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                companyData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                companyData = res.data.data;
            } else if (Array.isArray(res.data?.companies)) {
                console.log("res.data.companies berhasil")
                companyData = res.data.companies;
            }

            setDistributors(companyData);
            localStorage.setItem("companies", JSON.stringify(companyData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch companies");
            setDistributors([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAgents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setAgents([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies?companyType=AGENT&limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let companyData: Company[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                companyData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                companyData = res.data.data;
            } else if (Array.isArray(res.data?.companies)) {
                console.log("res.data.companies berhasil")
                companyData = res.data.companies;
            }

            setAgents(companyData);
            localStorage.setItem("companies", JSON.stringify(companyData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch companies");
            setAgents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        companies,
        company,
        distributors,
        agents,
        loading,
        error,
        fetchCompanies,
        fetchCompanyById,
        fetchDistributors,
        fetchAgents,
        updateCompany,
        createCompany,
        deleteCompany
    };
}