"use client";
import { useState } from "react";
import axios from "axios";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                email,
                password,
            });

            const user = res.data.user;

            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                name,
                email,
                password,
                role: "SUPERADMIN",
                subRole: "ADMIN",
                companyId: "123",
            });

            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            return res.data.user;
        } catch (err: any) {
            setError(err.response?.data?.message || "Register failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    };

    const getToken = () => localStorage.getItem("access_token");

    return { login, register, logout, getToken, loading, error };
}