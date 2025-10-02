'use client'

import { useEffect, useState } from "react"
import SuccessModal from "../../../admincomponents/SuccessPopUpModal"
import Link from "next/link"
import { useUser } from "@/app/hooks/useUser"
import Image from "next/image"
import DropdownOneSelect from "../../../(superadmin)/superadmincomponents/DropdownOneSelect"
import { useRouter } from "next/navigation"
import ErrorPopUpModal from "../../../admincomponents/ErrorPopUpModal"

const subRoles = ["USER"]

const CreateUser = () => {
    const router = useRouter();
    const { createUser } = useUser();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyId: "",
        role: "",
        subRole: "",
    });

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const loggedInUser = JSON.parse(userStr);
            console.log(loggedInUser)

            setFormData((prev) => ({
                ...prev,
                companyId: loggedInUser?.companyId || "",
                role: loggedInUser?.role || "",
            }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createUser(formData);
            setSuccessMessage(`User ${res.name} berhasil dibuat`);
            setShowSuccess(true);
            setFormData({ name: "", email: "", password: "", companyId: "", role: "", subRole: "" });
            setTimeout(() => router.push(`/dashboard/manage-user/${formData.role}`), 1200);
        } catch (err) {
            setErrorMessage("Tidak Berhasil Membuat User");
            setShowError(true);
        }
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

                <div className="">
                    <label htmlFor="password" className="block font-semibold text-blue-900 mb-1">
                        Password
                    </label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg select-none"
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <Image
                                    src={"/assets/icons/eye-open.svg"}
                                    alt="Show password"
                                    width={20}
                                    height={20}
                                    priority
                                />
                            ) : (
                                <Image
                                    src={"/assets/icons/eye-off.svg"}
                                    alt="Hide password"
                                    width={20}
                                    height={20}
                                    priority
                                />
                            )}
                        </span>
                    </div>
                </div>

                <div>
                    <label htmlFor="companyId" className="block font-semibold text-blue-900 mb-1">Company</label>
                    <input
                        type="text"
                        id="companyId"
                        value={formData.companyId}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-full bg-gray-100 text-sm shadow-md"
                        disabled
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
                    <DropdownOneSelect
                        label="subRole"
                        options={subRoles.map((subRole) => ({
                            value: subRole,
                            label: subRole,
                        }))}
                        selected={formData.subRole || null}
                        onChange={(newSubRole) =>
                            setFormData((prev) => ({
                            ...prev,
                            subRole: newSubRole || "",
                            }))
                        }
                        placeholder="Select Sub Role"
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
            <ErrorPopUpModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                title="User Gagal dibuat"
                message={errorMessage}
            />
        </div>
    )
}

export default CreateUser
