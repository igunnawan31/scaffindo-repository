"use client"
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface ScanInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ScanInvoiceModal: React.FC<ScanInvoiceModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-2 sm:px-4">
            <div 
                className="
                    bg-white rounded-xl shadow-lg 
                    w-full max-w-5xl relative 
                    max-h-[90vh] overflow-y-auto mx-10
                    py-4 sm:py-6
                "
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 sm:right-6 right-3 text-white focus:outline-none cursor-pointer"
                > 
                    <div className="bg-blue-800 p-4 rounded-lg">
                        <IoClose className="w-5 h-5 text-white" /> 
                    </div>
                </button>
                <div className="p-4 sm:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ScanInvoiceModal;
