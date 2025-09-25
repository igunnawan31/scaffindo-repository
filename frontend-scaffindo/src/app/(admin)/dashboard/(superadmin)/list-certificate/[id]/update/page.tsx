"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import UserDummy from "@/app/data/UserDummy"
import Link from "next/link"
import SuccessModal from "@/app/(admin)/dashboard/admincomponents/SuccessPopUpModal"
import { useUser } from "@/app/hooks/useUser"
import { useRouter } from "next/navigation"
import { useProduct } from "@/app/hooks/useProduct"
import { useCertificate } from "@/app/hooks/useCertificate"
import DropdownOneSelect from "../../../superadmincomponents/DropdownOneSelect"

const UpdateCertificate = () => {
    const { id } = useParams<{id: string}>();
    const { certificate, fetchCertificateById, updateCertificate } = useCertificate();
    const { product, products, fetchProducts } = useProduct();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        expired: "",
        details: "",
        productId: "",
    });
    const [certificationDocs, setCertificationDocs] = useState<File | null>(null);
    
    useEffect(() => {
        if (id) fetchCertificateById(id);
        fetchProducts();
    }, [id, fetchCertificateById, fetchProducts]);

    useEffect(() => {
        if (!certificate) return;
        setFormData({
            name: certificate.name ?? "",
            expired: certificate.expired ?? "",
            details: certificate.details ?? "",
            productId: certificate.productId ?? "",
        });
    }, [certificate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "certificationDocs") => {
        if (!e.target.files || !e.target.files[0]) return;
        if (type === "certificationDocs") setCertificationDocs(e.target.files[0]);
    };

    const handleDropdownChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("expired", formData.expired);
            data.append("details", formData.details);
            data.append("productId", formData.productId);
            if (certificationDocs) data.append("certificationDocs", certificationDocs);
            
            await updateCertificate(id, data);
            setSuccessMessage("Certificate berhasil diupdate!");
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/list-certificate');
            }, 2000)
        } catch (err) {
            console.error("Update gagal:", err);
            setSuccessMessage("Gagal update certificate");
            setShowSuccess(true);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Update User</h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block font-semibold text-blue-900 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2"
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
                        placeholder="300000"
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
                        <span className="truncate text-gray-600">
                            {certificationDocs
                                ? certificationDocs.name
                                : (certificate?.document?.[0]?.path?.split("\\").pop() || "No document selected")}
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
                        className="p-3 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 cursor-pointer"
                    >
                        Update Certificate
                    </button>
                </div>
            </form>
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Certificate Berhasil diupdate"
                message={successMessage}
            />
        </div>
    )
}

export default UpdateCertificate
