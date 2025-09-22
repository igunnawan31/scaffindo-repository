"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

interface AuthProviderProps {
    children: React.ReactNode;
}

const PUBLIC_PATHS = ["/sign-in", "/register"];

export default function AuthProvider({ children }: AuthProviderProps) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token && !PUBLIC_PATHS.includes(pathname)) {
            toast.error("You must login first");
            router.push("/sign-in");
        } else {
            setLoading(false);
        }
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Checking authentication...</p>
            </div>
        );
    }

    return <>{children}</>;
}
