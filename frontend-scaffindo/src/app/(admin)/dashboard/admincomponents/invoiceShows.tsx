"use client"

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import InvoiceActionModal from "./InvoiceActionModal";
import { Invoice } from "@/app/type/types";
import QRCode from "qrcode";

type InvoiceShowsPageProps = {
    invoice: Invoice[];
    showButton?: boolean;
    buttonText?: string;
    link: string;
    onButtonClick?: (invoiceId: string) => void;
};

const InvoiceShowsPage: React.FC<InvoiceShowsPageProps> = ({
    showButton = false,
    invoice,
    buttonText = "Aksi",
    link,
    onButtonClick
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [modalInvoice, setModalInvoice] = useState<string | null>(null);
    const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const displayedInvoices = invoice.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [invoice]);

    useEffect(() => {
        setLoading(true);
        
        const missingInvoices = displayedInvoices.filter((lbl) => !qrDataUrls[lbl.id]);
        if (missingInvoices.length === 0) {
            setLoading(false);
            return;
        }

        Promise.all(
            missingInvoices.map(async (lbl) => {
                const url = await QRCode.toDataURL(lbl.id);
                setQrDataUrls((prev) => ({ ...prev, [lbl.id]: url}));
            })
        ).then(() => setLoading(false));
    }, [displayedInvoices]);

    return (
        <div className="flex flex-col gap-4 w-full">
            {loading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                    <div key={i} className="animate-pulse w-full bg-blue-200 h-44 rounded-lg"></div>
                ))
            ) : (
                displayedInvoices.map((inv) => (
                    <Link key={inv.id} className="w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition" href={`/dashboard/${link}/${inv.id}`} >
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Invoice</span>
                                    <span className="text-gray-400">{inv.id}</span>
                                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                                        {inv.labelIds?.length || 0} Label
                                    </span>
                                </div>
                                <div className="text-blue-900">
                                    {inv.status}
                                </div>
                            </div>

                            <div className="flex gap-4 items-center">
                                <Image
                                    src={qrDataUrls[inv.id] || "/placeholder.png"}
                                    alt="QR Code"
                                    width={80}
                                    height={80}
                                    unoptimized
                                    className="rounded-md object-cover"
                                />
                                <div className="flex-1">
                                    <h2 className="font-semibold text-blue-900">
                                        {inv.id}
                                    </h2>
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                        {inv.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">QR Invoice</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t pt-3">
                                <div className="text-blue-900 font-medium text-sm hover:underline">
                                    Lihat Detail Transaksi
                                </div>
                                {showButton && (
                                    <button
                                        className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalInvoice(inv.id);
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

            {invoice.length > 0 && !loading ? (
                <div className="mt-4 w-full">
                    <Pagination
                        totalItems={invoice.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onItemsPerPageChange={(items) => {
                            setItemsPerPage(items);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            ) : !loading ? (
                <p className="text-center text-gray-500 py-6">Tidak ada invoice untuk kategori ini.</p>
            ) : null}
        </div>
    );
};

export default InvoiceShowsPage;
