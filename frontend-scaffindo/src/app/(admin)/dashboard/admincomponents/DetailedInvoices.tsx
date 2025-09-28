'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import ScanInvoiceModal from "./ScanInvoiceModal";
import ScanProductAdmin from "./ScanProductAdmin";
import InvoiceActionModal from "./InvoiceActionModal";
import { useInvoice } from "@/app/hooks/useInvoices";
import QRCode from "qrcode";
import { useLabels } from "@/app/hooks/useLabels";
import SuccessModal from "./SuccessPopUpModal";
import { useRouter } from "next/navigation";
import { useCompany } from "@/app/hooks/useCompany";
import DropdownOneSelect from "../(superadmin)/superadmincomponents/DropdownOneSelect";

type Props = { 
    invoiceId: string;
    showButton?: boolean;
    acceptButton?: boolean;
    statusUpdate?: string;
    backHomeLink?: string;
    companyType?: "AGENT" | "RETAIL" | "CUSTOMER";
}

const DetailedInvoices = ({ invoiceId, showButton, statusUpdate, acceptButton, backHomeLink, companyType }: Props) => {
    const router = useRouter();
    const { fetchInvoiceById, updateInvoice , invoice } = useInvoice();
    const { fetchLabels, labels} = useLabels();
    const { fetchAgents, agents, fetchRetails, retails}= useCompany()
    const [openModal, setOpenModal] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [modalInvoice, setModalInvoice] = useState<string | null>(null);
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        nextCompanyId: "",
        status: "",
        description: "",
    });

    useEffect(() => {
        if (invoiceId) {
            fetchInvoiceById(invoiceId);
        }
        if(companyType === "AGENT") {
            fetchAgents();
        }
        if(companyType === "RETAIL") {
            fetchRetails();
        }
    }, [invoiceId, fetchAgents, fetchRetails]);

    useEffect(() => {
        if (invoice?.id) {
            QRCode.toDataURL(invoice.id).then(setQrDataUrl);
            fetchLabels();
        }
    }, [invoice]);

    const getLabelStatus = (labelId: string) => {
        const label = labels?.find((l: any) => l.id === labelId);
        return label?.status || "Unknown";
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!scannedCode) return;

        try {
            const res = await updateInvoice(scannedCode, {
                status: statusUpdate,
                nextCompanyId: companyType === "CUSTOMER" ? null : invoice?.nextCompanyId,
                title: formData.title,
                description: formData.description
            });
            console.log(res)

            setSuccessMessage(`Invoice ${scannedCode} updated successfully!`);
            setShowSuccess(true);
            setScannedCode(null);
            setFormData({ title: "", status: "", description: "", nextCompanyId: ""});
            setTimeout(() => {
                router.push('/dashboard/pengecekkan-barang');
            }, 2000)
        } catch (err) {
            setSuccessMessage("Gagal membuat invoice");
            setShowSuccess(true);
        }
    };

    const handleTerimaBarang = async (invoiceCode: string) => {
        if (!invoiceCode) return;

        try {
            await updateInvoice(invoiceCode, {
                status: statusUpdate,
                nextCompanyId: companyType === "CUSTOMER" ? null : formData.nextCompanyId,
                title: formData.title,
                description: formData.description
            });

            setSuccessMessage(`Invoice ${invoiceCode} updated successfully!`);
            setShowSuccess(true);
            setScannedCode(null);
            setFormData({ title: "", status: "", description: "", nextCompanyId: "" });
            setTimeout(() => {
                router.push(`/dashboard/pengecekkan-barang-${backHomeLink}`);
            }, 2000);
        } catch (err) {
            console.error("handleTerimaBarang error:", err);
            setSuccessMessage("Gagal membuat invoice");
            setShowSuccess(true);
        }
    };

    if (!invoice) {
        return (
            <div className="p-6">
                <h2 className="text-red-500 font-bold">Invoice not found</h2>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full">
            <div className="w-full py-5 block md:flex gap-5 rounded-lg overflow-hidden">
                <div className="md:w-1/2 w-full relative h-[24rem]">
                    <Image
                        src={qrDataUrl || "/placeholder.png"}
                        alt="QR Code"
                        width={300}
                        height={300} 
                        unoptimized 
                        className="mx-auto"
                    />
                </div>

                <div className="md:w-1/2 w-full mt-5 md:mt-0 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900">{invoice.id}</h1>
                        <p className="text-gray-600">{invoice.status}</p>
                        {scannedCode && (
                            <div className="mt-3 p-3 flex flex-col gap-4 border rounded-lg bg-gray-100">
                                <p>Scanned Code: {scannedCode}</p>
                                <div>
                                    <label htmlFor="Title" className="block font-semibold text-blue-900 mb-1">Title</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Title (e.g. Barang tiba)"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="Description" className="block font-semibold text-blue-900 mb-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <button
                                    className="w-full py-5 bg-yellow-500 text-white rounded-lg flex items-center justify-center hover:bg-yellow-600 cursor-pointer"
                                    onClick={handleUpdate}
                                >
                                    Submit Update
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-5">
                        {acceptButton && (
                            <div className="mt-3 p-3 flex flex-col gap-4 border rounded-lg bg-gray-100">
                                <div>
                                    <label htmlFor="Title" className="block font-semibold text-blue-900 mb-1">Title</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Title (e.g. Barang tiba)"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                {companyType !== "CUSTOMER" && (
                                    <DropdownOneSelect
                                        label="Company"
                                        options={(companyType === "AGENT" ? agents : companyType === "RETAIL" ? retails : []).map((c) => ({
                                            value: c.id,
                                            label: c.name,
                                        }))}
                                        selected={formData.nextCompanyId || null}
                                        onChange={(newCompanyId) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                nextCompanyId: newCompanyId || "",
                                            }))
                                        }
                                        placeholder={`Select ${companyType || "Company"}`}
                                    />
                                )}
                                <div>
                                    <label htmlFor="Description" className="block font-semibold text-blue-900 mb-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <button
                                    className="w-full py-5 bg-yellow-500 text-white rounded-lg flex items-center justify-center hover:bg-yellow-600 cursor-pointer"
                                    onClick={() => handleTerimaBarang(invoiceId)}
                                >
                                    Terima Barang
                                </button>
                            </div>
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

            <div className="mt-5">
                <h3 className="font-semibold text-lg mb-3">List Products</h3>
                <div className="space-y-3">
                    {invoice.labelIds?.map((labelId, index) => {
                        const id = typeof labelId === "string" ? labelId : labelId?.id;
                        const status = getLabelStatus(id);

                        return (
                            <div
                                key={id || index}
                                className="flex flex-col sm:flex-row justify-between items-center border rounded-lg p-3 shadow-sm gap-3 sm:gap-0"
                            >
                                <div className="flex gap-4 items-center justify-center sm:flex-col sm:gap-0 sm:items-start sm:justify-start">
                                    <p className="font-medium">{invoice.title || "Product"}</p>
                                    <p className="text-sm text-gray-500">Label ID: {id}</p>
                                </div>

                                {showButton && (
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-5">
                                        <span>{status}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
           <InvoiceActionModal
                isOpen={!!modalInvoice}
                title="Konfirmasi Permintaan"
                message={`Apakah Anda yakin untuk menerima invoice ${modalInvoice}?`}
                confirmText="Terima"
                cancelText="Batal"
                onConfirm={async () => {
                    if (!modalInvoice) return;

                    await handleTerimaBarang(modalInvoice);  // ✅ Kirim string invoice code
                    setModalInvoice(null);
                }}
                onCancel={() => setModalInvoice(null)}
            />
            <ScanInvoiceModal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <ScanProductAdmin onProductCode={(code) => {
                    setScannedCode(code);
                    setOpenModal(false);
                }} />
            </ScanInvoiceModal>
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                }}
                title="Invoice Updated"
                message={successMessage}
            />
        </div>
    )
}

export default DetailedInvoices