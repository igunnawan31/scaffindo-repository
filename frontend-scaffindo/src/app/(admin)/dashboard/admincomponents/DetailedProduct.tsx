import Image from "next/image"
import { useEffect, useState } from "react";
import { useProduct } from "@/app/hooks/useProduct";
import getImageUrl from "@/app/lib/path";
import { useInvoice } from "@/app/hooks/useInvoices";
import { useCompany } from "@/app/hooks/useCompany";
import DropdownOneSelect from "../(superadmin)/superadmincomponents/DropdownOneSelect";
import SuccessModal from "./SuccessPopUpModal";
import { generateLabelPDF } from "@/app/lib/generateLabelPDF";
import ErrorPopUpModal from "./ErrorPopUpModal";
interface DetailedProductProps {
    productId: string;
}

export default function DetailedProduct({ productId }: DetailedProductProps) {
    const { fetchProductById, product } = useProduct();
    const { fetchDistributors, distributors } = useCompany();
    const { createInvoice } = useInvoice();
    const [showDownloadPopup, setShowDownloadPopup] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [lastCreatedInvoice, setLastCreatedInvoice] = useState<{ id: string; labelIds: string[] } | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        productId: "",
        nextCompanyId: "",
        totalLabel: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        if (productId) {
            fetchProductById(productId);
        }
        fetchDistributors();
    }, [productId, fetchProductById, fetchDistributors]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            productId: Number(productId),
            nextCompanyId: formData.nextCompanyId,
            totalLabel: Number(formData.totalLabel),
            title: `Label for ${product?.name}`,
            description: `Printing ${formData.totalLabel} labels for ${product?.name} to ${
            distributors.find(d => d.id === formData.nextCompanyId)?.name || "Distributor"
            }`,
        };

        try {
            const res = await createInvoice(payload);
            setSuccessMessage(`Invoice ${res.id} berhasil dibuat`);
            setShowSuccess(true);
            setTimeout(() => {
            setShowSuccess(false);
            setShowDownloadPopup(true);
            setLastCreatedInvoice({
                id: res.id,
                labelIds: res.labelIds || [],
            });
            }, 2000);
        } catch (err) {
            setErrorMessage(`Gagal membuat Invoice`);
            setShowError(true);
        }
    };

    if (!product) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold text-red-500">Product not found</h1>
            </div>
        );
    }
    return (
        <div className="w-full">
            <div className="w-full py-5 block md:flex gap-5 rounded-lg overflow-hidden">
                <div className="md:w-1/2 w-full relative h-[24rem]">
                    <Image
                        src={getImageUrl(product.image[product.image.length - 1].path)}
                        alt={product.image[product.image.length - 1]?.filename ?? "Product image"}
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                <div className="mt-6 md:mt-0 md:w-1/2 w-full p-4 bg-gray-200 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-blue-900">{product.name}</h1>
                    <p className="text-gray-700 mt-2">{product.description}</p>
                </div>
            </div>
            <div className="w-full gap-5 py-5">
                <h2 className="text-xl font-bold text-blue-900 mb-5">Print Label Form</h2>
                <form id="print-label-form" className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="totalLabel" className="block font-semibold text-blue-900 mb-1">Total Pieces</label>
                        <input
                            type="number"
                            id="totalLabel"
                            value={formData.totalLabel}
                            onChange={handleChange}
                            placeholder="10 / 100 / 200"
                            className={`w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 `}
                            // ${errors.email ? 'focus:ring-red-400 border border-red-400' : 'focus:ring-red-400'} error
                        />
                        {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>} */}
                    </div>
                    <div>
                        <DropdownOneSelect
                            label="Company"
                            options={distributors.map((c) => ({
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
                            placeholder="Select Distributor"
                        />
                        {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>} */}
                    </div>
                </form>
            </div>
            
            <button
                type="submit"
                form="print-label-form"
                className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
                Print Label
            </button>
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    setShowDownloadPopup(true);
                }}
                title="Invoice berhasil dibuat"
                message={successMessage}
            />
            <ErrorPopUpModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                title="Invoice Gagal dibuat"
                message={errorMessage}
            />

            {showDownloadPopup && lastCreatedInvoice && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-xl font-semibold mb-3">Download Labels</h2>
                    <p className="mb-4">Invoice berhasil dibuat! Download label sekarang?</p>

                    <button
                        className="mr-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500"
                        onClick={async () => {
                            await generateLabelPDF(lastCreatedInvoice, {
                                labelTextSize: 10,
                            });
                            setShowDownloadPopup(false);
                        }}
                    >
                        Download PDF
                    </button>

                    <button
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                        onClick={() => setShowDownloadPopup(false)}
                    >
                        Nanti Saja
                    </button>
                    </div>
                </div>
            )}
        </div>
    )
}
