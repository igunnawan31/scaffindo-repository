'use client'

import { useEffect, useState } from "react"
import SuccessModal from "../../../admincomponents/SuccessPopUpModal"
import Link from "next/link"
import { useUser } from "@/app/hooks/useUser"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCompany } from "@/app/hooks/useCompany"

const roles = ["Factory", "Distributor", "Customer"]
const subRoles = ["Admin", "User"]

const CreateCompany = () => {
    const router = useRouter();
    const { createCompany, loading, error } = useCompany();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createCompany(formData);
            setSuccessMessage(`Company ${res.name} berhasil dibuat`);
            setShowSuccess(true);
            setFormData({ name: "" });
            setTimeout(() => {
                router.push('/dashboard/list-company');
            }, 2000)
        } catch (err) {
            console.error("Failed to create company:", err);
        }
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Create Company</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block font-semibold text-blue-900 mb-1">Nama Company</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="PT. Sucofindo"
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex justify-between">
                    <Link
                        href={'/dashboard/list-company'}
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
                title="User Berhasil dibuat"
                message={successMessage}
            />
        </div>
    )
}

export default CreateCompany
