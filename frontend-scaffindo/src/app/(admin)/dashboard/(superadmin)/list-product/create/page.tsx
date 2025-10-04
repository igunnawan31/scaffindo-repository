"use client"

import { useEffect, useState } from "react"
import SuccessModal from "../../../admincomponents/SuccessPopUpModal"
import Link from "next/link"
import { useProduct } from "@/app/hooks/useProduct"
import { useCertificate } from "@/app/hooks/useCertificate"
import DropdownMultipleSelect from "../../superadmincomponents/DropdownMultipleSelect"
import { useCompany } from "@/app/hooks/useCompany"
import DropdownOneSelect from "../../superadmincomponents/DropdownOneSelect"
import { useRouter } from "next/navigation"
import ErrorPopUpModal from "../../../admincomponents/ErrorPopUpModal"

const CATEGORY_OPTIONS = ["CLOTHING", "FOOD_BEVERAGE", "ELECTRONIC"] as const

type CertificateOption = {
    id: string
    name: string
}

type FormState = {
    name: string
    description: string
    price: string
    companyId: string
    categories: string[]
    certifications: string[]
}

const CreateProduct = () => {
    const router = useRouter();
    const { createProduct } = useProduct();
    const { companies, fetchCompanies} = useCompany();
    const { certificates: certOptions = [], fetchCertificates } = useCertificate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState<FormState>({
        name: "",
        description: "",
        price: "",
        companyId: "",
        categories: [],
        certifications: [],
    })
    const [image, setImage] = useState<File | null>(null)

    useEffect(() => {
        fetchCertificates()
        fetchCompanies()
    }, [fetchCertificates, fetchCompanies])

    const handleFieldChange = (k: keyof FormState, v: string) =>
        setFormData((s) => ({ ...s, [k]: v }))

    const handleMultiChange = (
        k: "categories" | "certifications",
        values: string[]
    ) => setFormData((s) => ({ ...s, [k]: values }))

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "image"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validExtensions = [".jpeg", ".png"];
        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

        if (!validExtensions.includes(ext)) {
            setErrorMessage("Hanya format .jpeg dan .png yang diperbolehkan! (.jpg tidak diterima)");
            setShowError(true);
            e.target.value = "";
            setImage(null);
            return;
        }

        setImage(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.price || !formData.companyId || !formData.categories) {
            setErrorMessage("Nama, Harga, Deskripsi, dan Company wajib diisi!");
            setShowError(true);
            return;
        }

        if (!image) {
            setErrorMessage("Gambar produk wajib diupload!");
            setShowError(true);
            return;
        }

        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("description", formData.description)
            data.append("price", formData.price)
            data.append("companyId", formData.companyId)
            data.append("image", image)

            if (formData.categories.length > 0) {
                data.append("categories", JSON.stringify(formData.categories))
            }

            if (formData.certifications.length > 0) {
                data.append("certifications", JSON.stringify(formData.certifications))
            }

            if (image) data.append("image", image)

            await createProduct(data)

            setSuccessMessage("Product berhasil dibuat!")
            setShowSuccess(true)
            setFormData({
                name: "",
                description: "",
                price: "",
                companyId: "",
                categories: [],
                certifications: [],
            })
            setImage(null)
            setTimeout(() => router.push("/dashboard/list-product"), 1200);
        } catch (err) {
            setErrorMessage("Tidak Berhasil Membuat Product");
            setShowError(true);
        }
    }

    const categoryOptions = CATEGORY_OPTIONS.map((c) => ({
        value: c,
        label: c,
    }))

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Create Product</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="block font-semibold text-blue-900 mb-1">Name</label>
                    <input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block font-semibold text-blue-900 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleFieldChange("description", e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block font-semibold text-blue-900 mb-1">Price</label>
                    <input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleFieldChange("price", e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <DropdownOneSelect
                        label="Company"
                        options={companies.map((c: any) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                        selected={formData.companyId || null}
                        onChange={(val) => handleFieldChange("companyId", val || "")}
                        placeholder="Select Company"
                    />
                </div>

                <div>
                    <DropdownMultipleSelect
                        label="Categories"
                        options={categoryOptions}
                        selected={formData.categories}
                        onChange={(vals: any) => handleMultiChange("categories", vals)}
                        placeholder="Select categories"
                    />
                </div>
                
                <div>
                    <label className="block font-semibold text-blue-900 mb-1">Image (JPEG/PNG)</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => handleFileChange(e, "image")}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                </div>

                <div className="flex justify-between">
                    <Link
                        href={"/dashboard/list-product"}
                        className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="p-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                        Create Product
                    </button>
                </div>
            </form>

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Create Product berhasil"
                message={successMessage}
            />
            <ErrorPopUpModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                title="Product Gagal dibuat"
                message={errorMessage}
            />
        </div>
    )
}

export default CreateProduct
