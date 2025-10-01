"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5"; 

type ErrorPopUpModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    showButton?: boolean;
};

const ErrorPopUpModal = ({
    isOpen,
    onClose,
    title = "Berhasil!",
    message = "Aksi telah berhasil dilakukan.",
    showButton = true,
}: ErrorPopUpModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full text-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IoCloseCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">{title}</h2>
                        <p className="text-gray-600">{message}</p>

                        {showButton && (
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500"
                            >
                                OK
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ErrorPopUpModal;
