"use client"

import SearchProducts from "../../admincomponents/SearchProducts";
import CategoryProducts from "../../admincomponents/CategoryProducts";
import { useEffect, useMemo, useState } from "react";
import InvoiceShowsPage from "../../admincomponents/invoiceShows";
import { useInvoice } from "@/app/hooks/useInvoices";
import { Invoice } from "@/app/type/types";

const PengirimanBarangDistributor = () => {
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
                { label: "Waiting Agent", value: "WAITING_AGENT" },
                { label: "Agent Accepted", value: "AGENT_ACCEPTED" },
                { label: "Waiting Retail", value: "WAITING_RETAIL" },
                { label: "Retail Accepted", value: "RETAIL_ACCEPTED" },
                { label: "Arrived At Retail", value: "ARRIVED_AT_RETAIL" },
                { label: "Purchased by Customer", value: "PURCHASED_CUSTOMER" },
                { label: "All", value: "all" },
            ],
        },
    ];

    const handleFilterSelect = (type: string, value: string | null) => {
        if (type === "status") {
            setSelectedCategory(value);
        }
    };    

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
            "WAITING_AGENT",
            "AGENT_ACCEPTED",
            "WAITING_RETAIL",
            "RETAIL_ACCEPTED",
            "ARRIVED_AT_RETAIL",
            "PURCHASED_CUSTOMER",
        ];
        return invoices.filter((p: Invoice) => {
            const matchCompany = p.companyId === companyId;
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
                <InvoiceShowsPage invoice={filteredInvoices} link={"pengiriman-barang-distributor"}/>
            </div>
        </>
    )
}

export default PengirimanBarangDistributor