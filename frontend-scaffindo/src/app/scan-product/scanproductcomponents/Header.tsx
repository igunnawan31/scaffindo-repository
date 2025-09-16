"use client";

import { useEffect, useState } from "react";
import Path from "./Path";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();
    const [backText, setBackText] = useState("Back");

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.history.length > 1) {
                setBackText("« Back to Previous Page");
            } else {
                setBackText("« Back to Home");
            }
        }
    }, []);

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <div className="flex justify-between items-center w-full">
            <div
                onClick={handleBack}
                className="p-3 bg-blue-900 border-2 border-blue-900 text-white 
                hover:bg-white hover:border-blue-900 hover:text-blue-900
                rounded-lg font-semibold flex items-center text-sm cursor-pointer"
            >
                {backText}
            </div>
            <Path />
        </div>
    );
};

export default Header;
