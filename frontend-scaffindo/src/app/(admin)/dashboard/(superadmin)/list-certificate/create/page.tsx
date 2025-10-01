'use client'

import { useEffect, useState } from "react"
import SuccessModal from "../../../admincomponents/SuccessPopUpModal"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProduct } from "@/app/hooks/useProduct"
import { useCertificate } from "@/app/hooks/useCertificate"
import DropdownOneSelect from "../../superadmincomponents/DropdownOneSelect"
import ErrorPopUpModal from "../../../admincomponents/ErrorPopUpModal"

const CreateCertificate = () => {
    const router = useRouter();
    const { fetchProducts, products } = useProduct();
    const { createCertificate } = useCertificate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        expired: "",
        details: "",
        productId: "",
    });
    const [certificationDocs, setCertificationDocs] = useState<File | null>(null)

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "certificationDocs") => {
        if (!e.target.files || !e.target.files[0]) return
        if (type === "certificationDocs") setCertificationDocs(e.target.files[0])
    }

    const handleDropdownChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("name", formData.name)
            data.append("expired", formData.expired)
            data.append("details", formData.details)
            data.append("productId", formData.productId)

            if (certificationDocs) data.append("certificationDocs", certificationDocs)
            
            await createCertificate(data)

            setSuccessMessage(`Sertifikat berhasil dibuat`);
            setShowSuccess(true);
            setFormData({ 
                name: "",
                expired: "",
                details: "",
                productId: "",
            });
            setCertificationDocs(null)
            setTimeout(() => router.push("/dashboard/list-certificate"), 2000);
        } catch (err) {
            setErrorMessage("Tidak Berhasil Membuat Sertifikat");
            setShowError(true);
        }
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Create User</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block font-semibold text-blue-900 mb-1">Nama</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="ISO 3001"
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label htmlFor="expired" className="block font-semibold text-blue-900 mb-1">
                        expired
                    </label>
                    <input
                        type="date"
                        id="expired"
                        value={formData.expired}
                        onChange={handleChange}
                        placeholder="23 November 2025"
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2"
                    />
                </div>

                <div>
                    <label htmlFor="details" className="block font-semibold text-blue-900 mb-1">
                        Details
                    </label>
                    <input
                        type="text"
                        id="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="detail certificate..."
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2"
                    />
                </div>

                <div>
                    <DropdownOneSelect
                        label="Product"
                        options={products.map((c: any) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                        selected={formData.productId || null}
                        onChange={(val) => handleDropdownChange("productId", val || "")}
                        placeholder="Select Product"
                    />
                </div>

                <div>
                    <label className="block font-semibold text-blue-900 mb-1">Certification Docs</label>
                    <div className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus-within:ring-2 focus-within:ring-blue-400 flex items-center justify-between">
                        <span className="truncate text-gray-400">
                            {certificationDocs ? certificationDocs.name : "No document selected"}
                        </span>
                        <input
                            type="file"
                            id="certDocUpload"
                            onChange={(e) => handleFileChange(e, "certificationDocs")}
                            className="hidden"
                        />
                        <label
                            htmlFor="certDocUpload"
                            className="ml-3 p-3 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 text-md"
                        >
                            {certificationDocs ? "Change" : "Upload"}
                        </label>
                    </div>
                </div>

                <div className="flex justify-between">
                    <Link
                        href={'/dashboard/list-certificate'}
                        className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 cursor-pointer"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                    >
                        Create
                    </button>
                </div>
            </form>
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Sertifikat Berhasil dibuat"
                message={successMessage}
            />
            <ErrorPopUpModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                title="Sertifikat Gagal dibuat"
                message={errorMessage}
            />
        </div>
    )
}

export default CreateCertificate
