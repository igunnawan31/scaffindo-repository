"use client"

import Image from "next/image"
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const CardLogin = () => {
    const {login, loading, error} = useAuth();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await login(form.email, form.password);
            if (user) {
                toast.success("Login Berhasil");
                router.push("/dashboard");
            } else {
                toast.error("Login gagal");
            }
        } catch (err) {
            console.error("Login error", err);
            toast.error("Login failed");
        }
    };

    return (
        <div className="w-full mx-10 lg:w-1/4 md:w-1/2 bg-white shadow-lg p-6 border border-gray-200 rounded-lg">
            <div className="relative z-10">
                <Link
                    href='/' 
                    className="flex items-center text-sm sm:text-base z-10 mb-5 hover:opacity-50"
                >
                    <Image 
                        src={"/assets/icons/back.svg"} 
                        alt="Back" 
                        width={10} 
                        height={10} 
                    />
                    <span className="ml-2 text-blue-900 text-sm">Back To Home</span>
                </Link>
                <h1 className="text-4xl font-bold text-blue-900 text-center mb-2">Login</h1>
                <h2 className="text-center text-sm text-blue-900 mb-6">
                    Welcome to Sucofindo Business Partner
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block font-semibold text-blue-900 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value})}
                            placeholder="Email"
                            className={`w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 `}
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block font-semibold text-blue-900 mb-1">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value})}
                            placeholder="Password"
                            className={`w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2`}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-500 cursor-pointer text-lg select-none"
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? 
                                <Image
                                    src={"/assets/icons/eye-open.svg"}
                                    alt="Login Icon"
                                    width={20}
                                    height={20}
                                    priority
                                />
                                : 
                                <Image
                                    src={"/assets/icons/eye-off.svg"}
                                    alt="Login Icon"
                                    width={20}
                                    height={20}
                                    priority
                                />
                            }
                        </span>
                    </div>

                    <div className="flex justify-center mt-5">
                        <button 
                            type="submit"
                            disabled={loading} 
                            className={`w-2/6 py-3 rounded-full bg-blue-900 border-2 border-blue-900 text-white font-semibold hover:bg-white hover:text-blue-900 hover:border-blue-900 transition cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    )
}

export default CardLogin