'use client'

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { IoCreateOutline, IoTrashOutline, IoAddCircle } from "react-icons/io5"
import SuccessModal from "../../admincomponents/SuccessPopUpModal"
import CategoryProducts from "../../admincomponents/CategoryProducts"
import SearchProducts from "../../admincomponents/SearchProducts"
import Pagination from "../../admincomponents/Pagination"
import { User } from "@/app/type/types"
import { useUser } from "@/app/hooks/useUser"

const AdminList = () => {
    const { users ,fetchUsersAdmin, deleteUser ,loading } = useUser();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUsersAdmin();
    }, [fetchUsersAdmin]);

    const roleUserFilters = [
        {
            type: "role",
            label: "User Role",
            options: [
                { label: "All", value: "all" },
                { label: "Distributor", value: "DISTRIBUTOR" },
                { label: "Retail", value: "RETAIL" },
                { label: "Agent", value: "AGENT" },
                { label: "Factory", value: "FACTORY" },
            ],
        },
    ];

    const handleFilterSelect = (type: string, value: string | null) => {
        if (type === "role") {
            setSelectedCategory(value);
            setCurrentPage(1);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter((user: User) => {
            const matchSearch = 
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchCategory =
                !selectedCategory ||
                selectedCategory === "all" ||
                user.role === selectedCategory;

            return matchSearch && matchCategory;
        });
    }, [users, searchQuery, selectedCategory]);

    const displayedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setSuccessMessage("User berhasil dihapus");
            setShowSuccess(true);
            await fetchUsersAdmin();
        } catch (error: any) {
            setSuccessMessage(error?.response?.data?.message || "Gagal menghapus user");
            setShowSuccess(true);
        }
    }
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    return (
        <>
            <div className="flex gap-3">
                <CategoryProducts filters={roleUserFilters} onSelect={handleFilterSelect} />
                <SearchProducts 
                    placeholder="Search user" 
                    onSearch={handleSearch}
                />
            </div>
            <div className="flex items-center justify-end mt-3">
                <Link
                    href={'/dashboard/list-admin/create'}
                    className="w-2/12 flex items-center justify-center gap-2 p-2 bg-blue-900 text-white rounded-lg hover:bg-yellow-600 cursor-pointer text-sm"
                >
                    < IoAddCircle />
                    Create New User
                </Link>
            </div>
            {displayedUsers.length > 0 ? (
                <div className="space-y-3 mt-3">
                    {displayedUsers.map((user) =>
                        <div
                            key={user.id}
                            className="flex justify-between items-center rounded-lg p-3 shadow-md gap-3"
                        >
                            <div className="flex justify-center flex-col gap-0 items-start">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-400">
                                    {user.role} • {user.subRole}
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-2">
                                <Link
                                    href={`/dashboard/list-admin/${user.id}/update`}
                                    className="flex items-center gap-2 p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                >
                                    <IoCreateOutline size={18} />
                                </Link>
                                <button 
                                    onClick={() => handleDelete(user.id)}
                                    className="flex items-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                                >
                                    <IoTrashOutline size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ): (
                <p className="text-gray-500 text-center">Belum ada user</p>
            )}
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Delete Sukses"
                message={successMessage}
            />
            {filteredUsers.length > 0 && (
                <div className="mt-4 w-full">
                    <Pagination
                        totalItems={filteredUsers.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onItemsPerPageChange={(items) => {
                            setItemsPerPage(items);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            )}
        </>
    )
}

export default AdminList