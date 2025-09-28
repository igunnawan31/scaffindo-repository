"use client"

import SearchProducts from "../../admincomponents/SearchProducts";
import CategoryProducts from "../../admincomponents/CategoryProducts";
import { useEffect, useMemo, useState } from "react";
import InvoiceShowsPage from "../../admincomponents/invoiceShows";
import { useInvoice } from "@/app/hooks/useInvoices";
import { Invoice } from "@/app/type/types";

const PermintaanBarangDistributor = () => {
    const {fetchInvoices, invoices} = useInvoice();
    const [searchQuery, setSearchQuery] = useState("");
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const statusFilters = [
        {
            type: "status",
            label: "Status Pengiriman",
            options: [
                { label: "Waiting Distributor", value: "WAITING_DISTRIBUTOR" },
                { label: "Accepted", value: "DISTRIBUTOR_ACCEPTED" },
                { label: "Picked Up", value: "DISTRIBUTOR_PICKED_UP" },
                { label: "Arrived", value: "ARRIVED_AT_DISTRIBUTOR" },
                { label: "All", value: "all" },
            ],
        },
    ];

    const handleFilterSelect = (type: string, value: string | null) => {
        if (type === "status") {
            setSelectedCategory(value);
        }
    };
    
    const handleAcceptInvoice = () => {
        console.log("Diaccept");
    }

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const loggedInUser = JSON.parse(userStr);
            if (loggedInUser?.companyId) {
                setCompanyId(loggedInUser.companyId);
            }
        }
    }, []);

    const filteredInvoices = useMemo(() => {
        const allowedStatuses = [
            "WAITING_DISTRIBUTOR",
            "DISTRIBUTOR_ACCEPTED",
            "DISTRIBUTOR_PICKED_UP",
            "ARRIVED_AT_DISTRIBUTOR"
        ];
        return invoices.filter((p: Invoice) => {
            const matchCompany = p.nextCompanyId === companyId;
            console.log(p.nextCompanyId)
            console.log(p.companyId)
            const matchStatus = allowedStatuses.includes(p.status);;
            const matchSearch =
                p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = !selectedCategory 
                || selectedCategory === "all" 
                || p.status === selectedCategory;

            return matchCompany && matchStatus && matchSearch && matchCategory;
        });
    }, [invoices, companyId, searchQuery, selectedCategory]);


    return (
        <>
            <div className="flex gap-3">
                <CategoryProducts filters={statusFilters} onSelect={handleFilterSelect} />
                <SearchProducts 
                    placeholder="Search your products" 
                    onSearch={handleSearch}
                />
            </div>
            <div className="mt-5">
                <InvoiceShowsPage link="permintaan-barang-distributor" showButton={true} buttonText="Accept" onButtonClick={ handleAcceptInvoice } invoice={filteredInvoices}/>
            </div>
        </>
    )
}

export default PermintaanBarangDistributor