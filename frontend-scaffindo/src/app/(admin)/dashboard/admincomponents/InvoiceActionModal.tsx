"use client";

import React from "react";

type InvoiceActionModalProps = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const InvoiceActionModal: React.FC<InvoiceActionModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = "Yes",
    cancelText = "No",
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                <h2 className="text-lg font-semibold text-blue-900">{title}</h2>
                <p className="mt-2 text-gray-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceActionModal;