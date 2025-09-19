'use client'

import invoiceProducts from "@/app/data/invoiceProducts";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Pagination from "./Pagination";
import InvoiceActionModal from "./InvoiceActionModal";

type InvoiceShowsPageProps = {
    // roleFilter?: string;
    // statusFilter?: string;
    showButton?: boolean;
    buttonText?: string;
    link: string;
    onButtonClick?: (invoiceId: string) => void;
};

const InvoiceShowsPage:React.FC<InvoiceShowsPageProps> = ({showButton, buttonText, link, onButtonClick}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [modalInvoice, setModalInvoice] = useState<string | null>(null);

    const allInvoices = invoiceProducts.flatMap((product) =>
            product.invoices.map((invoice) => ({
            ...invoice,
            product,
        }))
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInvoices = allInvoices.slice(
        startIndex,
        startIndex + itemsPerPage
    );
    
    return (
        <div className="flex flex-col gap-4 w-full">
            {invoiceProducts.map((product) =>
                product.invoices.map((invoice) => (
                    <Link
                        key={invoice.id}
                        href={`/dashboard/${link}/${invoice.id}`}
                        className="w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition"
                    >
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Invoice</span>
                                    <span className="text-gray-400">{invoice.id}</span>
                                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                                        {product.labels.length} Label
                                    </span>
                                </div>
                                <div className="text-blue-900">
                                    Butuh Pengecekkan
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={80}
                                    height={80}
                                    className="rounded-md object-cover"
                                />
                                <div className="flex-1">
                                    <h2 className="font-semibold text-blue-900">
                                        {product.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                        {product.description}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Labels: {invoice.labels.join(", ")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">QR Invoice</p>
                                    <p className="text-xs break-all text-gray-800">
                                        {invoice.qrCode}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t pt-3">
                                <div
                                    className="text-blue-900 font-medium text-sm hover:underline"
                                >
                                    Lihat Detail Transaksi
                                </div>
                                {showButton && (
                                    <button
                                        className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (onButtonClick) {
                                                setModalInvoice(invoice.id);
                                            }
                                        }}
                                    >
                                        {buttonText}
                                    </button>
                                )}
                            </div>
                        </div>
                    </Link>
                ))
            )}

            <InvoiceActionModal
                isOpen={!!modalInvoice}
                title="Konfirmasi Permintaan"
                message={`Apakah Anda yakin untuk menerima invoice ${modalInvoice}?`}
                confirmText="Terima"
                cancelText="Batal"
                onConfirm={() => {
                    if (modalInvoice && onButtonClick) {
                        onButtonClick(modalInvoice);
                    }
                    setModalInvoice(null);
                }}
                onCancel={() => setModalInvoice(null)}
            />
            
            <div className="mt-4 w-full">
                <Pagination
                    totalItems={invoiceProducts.length}
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
    );
};

export default InvoiceShowsPage;
