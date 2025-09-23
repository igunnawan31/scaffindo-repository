'use client'

import UserDummy from "@/app/data/UserDummy"
import Link from "next/link"
import { useEffect, useState } from "react"
import { IoCreateOutline, IoTrashOutline, IoAddCircle } from "react-icons/io5"
import SuccessModal from "../../admincomponents/SuccessPopUpModal"
import CategoryProducts from "../../admincomponents/CategoryProducts"
import SearchProducts from "../../admincomponents/SearchProducts"
import Pagination from "../../admincomponents/Pagination"
import { Company } from "@/app/type/types"
import { useCompany } from "@/app/hooks/useCompany"

const CompanyList = () => {
    const { companies, fetchCompanies, deleteCompany } = useCompany();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const filteredCompanies = companies.filter(
        (company: Company) =>
            company.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log(filteredCompanies.length);

    const displayedCompanies = filteredCompanies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id: string) => {
        try {
            await deleteCompany(id);
            setSuccessMessage("Company berhasil dihapus");
            setShowSuccess(true);

            await fetchCompanies();
        } catch (error: any) {
            setSuccessMessage(error?.response?.data?.message || "Gagal menghapus company");
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
                <CategoryProducts />
                <SearchProducts 
                    placeholder="Search user" 
                    onSearch={handleSearch}
                />
            </div>
            <div className="flex items-center justify-end mt-3">
                <Link
                    href={'/dashboard/list-company/create'}
                    className="w-2/12 flex items-center justify-center gap-2 p-2 bg-blue-900 text-white rounded-lg hover:bg-yellow-600 cursor-pointer text-sm"
                >
                    < IoAddCircle />
                    Create New Company
                </Link>
            </div>
            {displayedCompanies.length > 0 ? (
                <div className="space-y-3 mt-3">
                    {displayedCompanies.map((company) =>
                        <div
                            key={company.id}
                            className="flex justify-between items-center rounded-lg p-3 shadow-md gap-3"
                        >
                            <div className="flex justify-center flex-col gap-0 items-start">
                                <p className="font-medium">{company.name}</p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-2">
                                <Link
                                    href={`/dashboard/list-company/${company.id}/update`}
                                    className="flex items-center gap-2 p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                >
                                    <IoCreateOutline size={18} />
                                </Link>
                                <button 
                                    onClick={() => handleDelete(company.id)} 
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
            <div className="mt-4 w-full">
                <Pagination
                    totalItems={filteredCompanies.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onItemsPerPageChange={(items) => {
                        setItemsPerPage(items);
                        setCurrentPage(1);
                    }}
                />
            </div>
        </>
    )
}

export default CompanyList