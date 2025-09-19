'use client'

import { useState, useEffect } from "react";
import invoiceProducts from "@/app/data/invoiceProducts";
import Image from "next/image";
import ScanInvoiceModal from "./ScanInvoiceModal";
import ScanProduct from "@/app/scan-product/scanproductcomponents/ScanProductModal";
import ScanProductAdmin from "./ScanProductAdmin";
import InvoiceActionModal from "./InvoiceActionModal";

type Props = { 
    invoiceId: string
    showButton?: boolean;
    acceptButton?: boolean;
    onButtonClick?: (invoiceId: string) => void;
}

const DetailedInvoices = ({ invoiceId, showButton, acceptButton, onButtonClick}: Props) => {
    const [openModal, setOpenModal] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [modalInvoice, setModalInvoice] = useState<string | null>(null);
    
    const product = invoiceProducts.find((p) =>
        p.invoices.some((inv) => inv.id === invoiceId)
    );
    const invoice = product?.invoices.find((inv) => inv.id === invoiceId);
    if (!product || !invoice) {
        return (
            <div className="p-6">
                <h2 className="text-red-500 font-bold">Invoice not found</h2>
            </div>
        );
    }

    const invoiceLabels = product.labels.filter((label) =>
        invoice.labels.includes(label.id)
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full">
            <div className="w-full py-5 block md:flex gap-5 rounded-lg overflow-hidden">
                <div className="md:w-1/2 w-full relative h-[24rem]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                <div className="md:w-1/2 w-full mt-5 md:mt-0 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900">{invoice.id}</h1>
                        <p className="text-gray-600">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                    <div className="mt-5">
                        {acceptButton && (
                            <button
                                className="w-full py-5 bg-yellow-500 text-white rounded-lg flex items-center justify-center hover:bg-yellow-600 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (onButtonClick) {
                                        setModalInvoice(invoice.id);
                                    }
                                }}
                            >
                                Terima Barang
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {showButton && (
                <div
                    className="w-full py-5 bg-yellow-500 text-white rounded-lg flex items-center justify-center hover:bg-yellow-600 cursor-pointer"
                    onClick={() => setOpenModal(true)}
                >
                    <span className="font-semibold">Scan Invoice</span>
                </div>
            )}

            {scannedCode && (
                <div className="mt-3 p-3 border border-green-600 rounded-lg bg-green-50 text-green-700">
                    Scanned Code: {scannedCode}
                </div>
            )}

            <div className="mt-5">
                <h3 className="font-semibold text-lg mb-3">List Products</h3>
                <div className="space-y-3">
                    {invoiceLabels.map((label) => (
                        <div
                            key={label.id}
                            className="flex flex-col sm:flex-row justify-between items-center border rounded-lg p-3 shadow-sm gap-3 sm:gap-0"
                        >
                            <div className="flex gap-4 items-center justify-center sm:flex-col sm:gap-0 sm:items-start sm:justify-start">
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">
                                QR: {label.qrCode}
                                </p>
                            </div>
                            {showButton && (
                                <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-5">
                                    <span>Butuh Pengecekkan</span>
                                    <button className="block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer">
                                        Scan Product
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
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
            <ScanInvoiceModal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ScanProductAdmin onProductCode={(code) => console.log(code)} />
            </ScanInvoiceModal>
        </div>
    )
}

export default DetailedInvoices