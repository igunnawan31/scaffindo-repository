'use client'

import { useState } from "react";
import invoicePenjualan from "@/app/data/invoicePenjualan";
import Pagination from "../../admincomponents/Pagination";

type InvoicePenjualan = {
    id: string;
    customer: {
        name: string;
        contact: string;
    };
    labels: {
        labelId: string;
        productId: number;
        productName: string;
        harga: number;
    }[];
    totalHarga: number;
    paymentMethod: string;
    soldAt: string;
};

const HistoryPenjualan = () => {
    const [invoices] = useState<InvoicePenjualan[]>(invoicePenjualan);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const displayedInvoices = invoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

    const formatDate = (date: string) =>
    new Date(date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });



    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">📜 History Penjualan</h2>
            {invoices.length > 0 ? (
                <div className="space-y-4">
                    {invoices.map((inv) => (
                        <div
                            key={inv.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold">#{inv.id}</p>
                                <span className="text-sm text-gray-500">{formatDate(inv.soldAt)}</span>
                            </div>

                            <ul className="mt-2 space-y-1">
                                {inv.labels.map((l) => (
                                    <li
                                        key={l.labelId}
                                        className="flex justify-between text-sm text-gray-600 border-b pb-1"
                                    >
                                        <span>{l.productName} ({l.labelId})</span>
                                        <span>{formatCurrency(l.harga)}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex justify-between items-center mt-3 font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(inv.totalHarga)}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">💳 {inv.paymentMethod}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">Belum ada penjualan</p>
            )}
            <div className="mt-4 w-full">
                <Pagination
                    totalItems={invoices.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onItemsPerPageChange={(items) => {
                        setItemsPerPage(items);
                        setCurrentPage(1);
                    }}
                />
            </div>
        </div>
    )
}

export default HistoryPenjualan