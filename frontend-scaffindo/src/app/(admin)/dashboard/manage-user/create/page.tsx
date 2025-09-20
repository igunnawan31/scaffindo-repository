'use client'

import { useState } from "react"
import SuccessModal from "../../admincomponents/SuccessPopUpModal"
import Link from "next/link"

const roles = ["Factory", "Distributor", "Customer"]
const subRoles = ["Admin", "User"]

const CreateUser = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        subRole: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Create User:", formData)
        setShowSuccess(true);
        setFormData({ name: "", email: "", role: "", subRole: "" })
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Create User</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block font-semibold text-blue-900 mb-1">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block font-semibold text-blue-900 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@mail.com"
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block font-semibold text-blue-900 mb-1">Role</label>
                    <select
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">-- Select Role --</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="subRole" className="block font-semibold text-blue-900 mb-1">Subrole</label>
                    <select
                        id="subRole"
                        value={formData.subRole}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">-- Select Subrole --</option>
                        {subRoles.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
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

export default CreateUser
