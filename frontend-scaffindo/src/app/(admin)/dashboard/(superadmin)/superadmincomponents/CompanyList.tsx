"use client"

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IoCreateOutline, IoTrashOutline, IoAddCircle } from "react-icons/io5";
import SuccessModal from "../../admincomponents/SuccessPopUpModal";
import CategoryProducts from "../../admincomponents/CategoryProducts";
import SearchProducts from "../../admincomponents/SearchProducts";
import Pagination from "../../admincomponents/Pagination";
import { Company } from "@/app/type/types";
import { useCompany } from "@/app/hooks/useCompany";

const CompanyList = () => {
    const { companies, fetchCompanies, deleteCompany } = useCompany();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const companyTypeFilters = [
        {
            type: "companyType",
            label: "Company Type",
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
        if (type === "companyType") {
            setSelectedCategory(value);
            setCurrentPage(1);
        }
    };

    const filteredCompanies = useMemo(() => {
        return companies.filter((company: Company) => {
            const matchSearch = company.name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchCategory =
                !selectedCategory ||
                selectedCategory === "all" ||
                company.companyType === selectedCategory;

            return matchSearch && matchCategory;
        });
    }, [companies, searchQuery, selectedCategory]);

    const displayedCompanies = filteredCompanies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

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
    };

    return (
        <>
            <div className="flex gap-3">
                <CategoryProducts filters={companyTypeFilters} onSelect={handleFilterSelect} />
                <SearchProducts placeholder="Search user" onSearch={handleSearch} />
            </div>

            <div className="flex items-center justify-end mt-3">
                <Link
                    href={'/dashboard/list-company/create'}
                    className="w-2/12 flex items-center justify-center gap-2 p-2 bg-blue-900 text-white rounded-lg hover:bg-yellow-600 cursor-pointer text-sm"
                >
                    <IoAddCircle />
                    Create New Company
                </Link>
            </div>

            {displayedCompanies.length > 0 ? (
                <div className="space-y-3 mt-3">
                    {displayedCompanies.map((company) => (
                        <div
                            key={company.id}
                            className="flex justify-between items-center rounded-lg p-3 shadow-md gap-3"
                        >
                            <div>
                                <p className="font-medium">{company.name}</p>
                                <p className="text-sm text-gray-500">{company.companyType}</p>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/dashboard/list-company/${company.id}/update`}
                                    className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                >
                                    <IoCreateOutline size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(company.id)}
                                    className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    <IoTrashOutline size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-6">No companies found.</p>
            )}

            {filteredCompanies.length > 0 && (
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
            )}

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Delete Success"
                message={successMessage}
            />
        </>
    );
};

export default CompanyList;
