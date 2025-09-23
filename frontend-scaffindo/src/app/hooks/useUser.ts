'use client'

import { useCallback, useEffect, useState } from "react";
import { User } from "../type/types";
import axios from "axios";

export function useUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsersAdmin = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setUsers([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?subRole=ADMIN`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let userData: User[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                userData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                userData = res.data.data;
            } else if (Array.isArray(res.data?.users)) {
                console.log("res.data.users berhasil")
                userData = res.data.users;
            }

            setUsers(userData);
            localStorage.setItem("users", JSON.stringify(userData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsersFactory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setUsers([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?Role=FACTORY`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let userData: User[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                userData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                userData = res.data.data;
            } else if (Array.isArray(res.data?.users)) {
                console.log("res.data.users berhasil")
                userData = res.data.users;
            }

            setUsers(userData);
            localStorage.setItem("users", JSON.stringify(userData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsersDistributor = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setUsers([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?Role=DISTRIBUTOR`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let userData: User[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                userData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                userData = res.data.data;
            } else if (Array.isArray(res.data?.users)) {
                console.log("res.data.users berhasil")
                userData = res.data.users;
            }

            setUsers(userData);
            localStorage.setItem("users", JSON.stringify(userData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsersAgent = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setUsers([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?Role=AGENT`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let userData: User[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                userData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                userData = res.data.data;
            } else if (Array.isArray(res.data?.users)) {
                console.log("res.data.users berhasil")
                userData = res.data.users;
            }

            setUsers(userData);
            localStorage.setItem("users", JSON.stringify(userData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsersRetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            if (!token) {
                console.warn("⚠️ No token found in localStorage");
                setUsers([]);
                return;
            }

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?Role=RETAIL`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let userData: User[] = [];
            
            if (Array.isArray(res.data)) {
                console.log("res.data berhasil")
                userData = res.data;
            } else if (res.data && Array.isArray(res.data.data)) {
                console.log("res.data.data berhasil")
                userData = res.data.data;
            } else if (Array.isArray(res.data?.users)) {
                console.log("res.data.users berhasil")
                userData = res.data.users;
            }

            setUsers(userData);
            localStorage.setItem("users", JSON.stringify(userData));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearUsers = () => {
        setUsers([]);
        localStorage.removeItem("users");
    };

    const fetchUserById = useCallback(async (id: string) => {
        try { 
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch user by ID");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUser = useCallback(async(id: string, updateData: Partial<User>) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");
            
            if (!token) {
                setError("No authentication token found");
                return;
            }

            const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, updateData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUser(res.data);
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? res.data : u))
            );

            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update user");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [])

    return { 
        users, 
        user,
        loading, 
        error, 
        fetchUsersAdmin, 
        fetchUsersAgent, 
        fetchUsersDistributor, 
        fetchUsersFactory, 
        fetchUsersRetail, 
        clearUsers,
        fetchUserById,
        updateUser,
    };
}