"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminDashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/sign-in");
        }
    }, [router]);
    return (
        <div className="px-8 text-blue-900 mb-32 w-full">

        </div>
    )
}

export default AdminDashboard