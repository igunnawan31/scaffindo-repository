"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import UserDummy from "@/app/data/UserDummy"
import Link from "next/link"
import SuccessModal from "@/app/(admin)/dashboard/admincomponents/SuccessPopUpModal"

const UpdateUser = () => {
    const { id } = useParams();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        subRole: "",
    })

    useEffect(() => {
        const user = UserDummy.find((u) => u.id === Number(id))
        if (user) {
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            subRole: user.subRole,
        })
        }
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setShowSuccess(true);
        console.log("Updated user:", { id, ...formData })
    }

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
                    <label htmlFor="email" className="block font-semibold text-blue-900 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="user@example.com"
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block font-semibold text-blue-900 mb-1">
                        Role
                    </label>
                    <select
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2"
                    >
                        <option value="">-- Select Role --</option>
                        <option value="Factory">Factory</option>
                        <option value="Distributor">Distributor</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="subRole" className="block font-semibold text-blue-900 mb-1">
                        Sub Role
                    </label>
                    <select
                        id="subRole"
                        value={formData.subRole}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2"
                    >
                        <option value="">-- Select Sub Role --</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>

                <div className="flex justify-between">
                    <Link
                        href={'/dashboard/manage-user'}
                        className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 cursor-pointer"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="p-3 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
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
        </div>
    )
}

export default UpdateUser
