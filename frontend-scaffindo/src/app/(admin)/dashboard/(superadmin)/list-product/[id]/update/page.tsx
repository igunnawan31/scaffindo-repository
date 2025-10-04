"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SuccessModal from "@/app/(admin)/dashboard/admincomponents/SuccessPopUpModal";
import { useProduct } from "@/app/hooks/useProduct";
import { useCertificate } from "@/app/hooks/useCertificate";
import DropdownMultipleSelect from "../../../superadmincomponents/DropdownMultipleSelect";
import Image from "next/image";
import {getImageUrl} from "@/app/lib/path";
import ErrorPopUpModal from "@/app/(admin)/dashboard/admincomponents/ErrorPopUpModal";
const CATEGORY_OPTIONS = ["CLOTHING", "FOOD_BEVERAGE", "ELECTRONIC"] as const;

type CertificateOption = {
    id: string;
    name: string;
};

type FormState = {
    name: string;
    description: string;
    price: string;
    companyId: string;
    categories: string[];
    certifications: string[];
};

export default function UpdateProduct() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { product, fetchProductById, updateProduct } = useProduct();
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
    });

    const [image, setImage] = useState<File | null>(null);
    const [certificationDocs, setCertificationDocs] = useState<File | null>(null);

    useEffect(() => {
        if (id) fetchProductById(id);
        fetchCertificates();
    }, [id, fetchProductById, fetchCertificates]);

    useEffect(() => {
    }, [certOptions, formData.certifications]);

    useEffect(() => {
        if (!product) return;

        const productCategories: string[] = Array.isArray(product.category)
            ? product.category.map((c: any) => (typeof c === "string" ? c : c.id))
            : [];

        const certIds: string[] = (product.certifications || []).map((c: any) =>
            typeof c === "string" ? c : c.id
        );

        setFormData({
            name: product.name ?? "",
            description: product.description ?? "",
            price: product.price?.toString() ?? "",
            companyId: product.companyId ?? "",
            categories: productCategories,
            certifications: certIds,
        });
    }, [product]);

    const handleFieldChange = (k: keyof FormState, v: string) =>
        setFormData((s) => ({ ...s, [k]: v }));

    const handleMultiChange = (k: "categories" | "certifications", values: string[]) =>
        setFormData((s) => ({ ...s, [k]: values }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "certificationDocs") => {
        if (!e.target.files || !e.target.files[0]) return;
        if (type === "image") setImage(e.target.files[0]);
        else setCertificationDocs(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("companyId", formData.companyId);

            if (formData.categories.length > 0) {
                data.append("categories", JSON.stringify(formData.categories));
            }

            if (formData.certifications.length > 0) {
                data.append("certifications", JSON.stringify(formData.certifications));
            }

            if (image) data.append("image", image);
            await updateProduct(id, data);

            setSuccessMessage("Product berhasil diupdate!");
            setShowSuccess(true);
            setTimeout(() => router.push("/dashboard/list-product"), 1200);
        } catch (err) {
            console.error(err);
            setErrorMessage("Gagal update product");
            setShowError(true);
        }
    };

    const categoryOptions = CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }));
    const certificateOptionsList: { value: string; label: string }[] = (certOptions || []).map(
        (c: CertificateOption) => ({ value: c.id, label: c.name })
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Update Product</h2>
            <div>
                <Image
                    src={product?.image?.[product.image.length-1].path ? getImageUrl(product.image[product.image.length - 1].path) : "/placeholder.png"}
                    alt={product?.image?.[product.image.length - 1]?.filename ?? "Product image"}
                    width={1200}
                    height={1200}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                />
            </div>
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
                    <label className="block font-semibold text-blue-900 mb-1">Description</label>
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
                    <label className="block font-semibold text-blue-900 mb-1">Company ID</label>
                    <input
                        id="companyId"
                        value={formData.companyId}
                        onChange={(e) => handleFieldChange("companyId", e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled
                    />
                </div>

                <div>
                    <DropdownMultipleSelect
                        label="Categories"
                        options={categoryOptions}
                        selected={formData.categories}
                        onChange={(vals) => handleMultiChange("categories", vals)}
                        placeholder="Select categories"
                    />
                </div>

                <div>
                    <DropdownMultipleSelect
                        label="Certifications"
                        options={certificateOptionsList}
                        selected={formData.certifications}
                        onChange={(vals) => handleMultiChange("certifications", vals)}
                        placeholder="Select certifications"
                        disabled
                    />
                </div>

                <div>
                    <label className="block font-semibold text-blue-900 mb-1">Image</label>

                    <div className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus-within:ring-2 focus-within:ring-blue-400 flex items-center justify-between">
                        <span className="truncate text-gray-600">
                        {image
                            ? image.name
                            : product?.image?.[product.image.length - 1]?.filename || "No image selected"}
                        </span>

                        <input
                            type="file"
                            id="imageUpload"
                            onChange={(e) => handleFileChange(e, "image")}
                            className="hidden"
                        />

                        <label
                            htmlFor="imageUpload"
                            className="ml-3 py-1 px-3 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 text-md"
                        >
                            {image ? "Change" : "Upload"}
                        </label>
                    </div>
                </div>

                <div className="flex justify-between">
                    <Link href={"/dashboard/list-product"} className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500">
                        Kembali
                    </Link>
                    <button type="submit" className="p-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">
                        Update Product
                    </button>
                </div>
            </form>

            <SuccessModal 
                isOpen={showSuccess} 
                onClose={() => setShowSuccess(false)} 
                title="Update product berhasil" 
                message={successMessage} 
            />

            <ErrorPopUpModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                title="Update product gagal"
                message={errorMessage}
            />
        </div>
    );
}
