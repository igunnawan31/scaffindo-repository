"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import SuccessModal from "@/app/(admin)/dashboard/admincomponents/SuccessPopUpModal"
import { useRouter } from "next/navigation"
import { useCompany } from "@/app/hooks/useCompany"

const UpdateCompany = () => {
    const { id } = useParams<{id: string}>();
    const { company, fetchCompanyById, updateCompany, loading } = useCompany();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
    });
    
    useEffect(() => {
        if (id) fetchCompanyById(id);
    }, [id, fetchCompanyById]);

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name,
            });
        }
    }, [company]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!id) return;
            await updateCompany(id, formData);
            setSuccessMessage("Company berhasil diupdate!");
            setShowSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/list-company');
            }, 2000)
        } catch (err) {
            console.error("Update gagal:", err);
            setSuccessMessage("Gagal update company");
            setShowSuccess(true);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Update Company</h2>
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
                        placeholder="PT. Sucofindo"
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2"
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
                        className="p-3 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 cursor-pointer"
                    >
                        Update Company
                    </button>
                </div>
            </form>
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Company Berhasil diupdate"
                message={successMessage}
            />
        </div>
    )
}

export default UpdateCompany
