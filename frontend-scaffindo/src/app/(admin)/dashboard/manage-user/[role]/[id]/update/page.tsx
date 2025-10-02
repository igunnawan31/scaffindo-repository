"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import SuccessModal from "@/app/(admin)/dashboard/admincomponents/SuccessPopUpModal"
import { useUser } from "@/app/hooks/useUser"
import { useRouter } from "next/navigation"
import ErrorPopUpModal from "@/app/(admin)/dashboard/admincomponents/ErrorPopUpModal"

const UpdateUser = () => {
    const { id } = useParams<{id: string}>();
    const { user, fetchUserById, updateUser, loading } = useUser();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        subRole: "",
    });
    
    useEffect(() => {
        if (id) fetchUserById(id);
    }, [id, fetchUserById]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                subRole: user.subRole,
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!id) return;
            await updateUser(id, formData);
            setSuccessMessage("User berhasil diupdate!");
            setShowSuccess(true);
            setTimeout(() => {
                router.push(`/dashboard/manage-user/${formData.role}`);
            }, 2000)
        } catch (err) {
            setErrorMessage("Tidak Berhasil Membuat User");
            setShowError(true);
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
                    <label htmlFor="email" className="block font-semibold text-blue-900 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 rounded-full bg-gray-100 text-sm shadow-md"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block font-semibold text-blue-900 mb-1">Role</label>
                    <input
                        type="text"
                        id="role"
                        value={formData.role}
                        disabled
                        className="w-full px-4 py-3 rounded-full bg-gray-100 text-sm shadow-md"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block font-semibold text-blue-900 mb-1">Sub Role</label>
                    <input
                        type="text"
                        id="role"
                        value={formData.subRole}
                        disabled
                        className="w-full px-4 py-3 rounded-full bg-gray-100 text-sm shadow-md"
                    />
                </div>

                <div className="flex justify-between">
                    <Link
                        href={`/dashboard/manage-user/${formData.role}`}
                        className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 cursor-pointer"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="p-3 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 cursor-pointer"
                    >
                        Update User
                    </button>
                </div>
            </form>
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="User Berhasil diupdate"
                message={successMessage}
            />
            <ErrorPopUpModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                title="User Gagal diupdate"
                message={errorMessage}
            />
        </div>
    )
}

export default UpdateUser
