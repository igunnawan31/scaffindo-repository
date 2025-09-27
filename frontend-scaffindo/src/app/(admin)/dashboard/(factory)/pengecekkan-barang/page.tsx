"use client"

import ProductShows from "../../admincomponents/ProductShows";
import dummyProducts from "@/app/data/productsData";
import SearchProducts from "../../admincomponents/SearchProducts";
import CategoryProducts from "../../admincomponents/CategoryProducts";
import { useEffect, useMemo, useState } from "react";
import InvoiceShowsPage from "../../admincomponents/invoiceShows";
import { useInvoice } from "@/app/hooks/useInvoices";
import { Invoice } from "@/app/type/types";

const PengecekkanBarang = () => {
    const {fetchInvoices, invoices} = useInvoice()
    const [searchQuery, setSearchQuery] = useState("");
    const [companyId, setCompanyId] = useState<string | null>(null);
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

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
        return invoices.filter((p: Invoice) => {
            const matchCompany = p.companyId === companyId;
            const matchStatus = p.status == "FACTORY_DONE";
            const matchSearch =
                p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());

            return matchCompany && matchStatus && matchSearch;
        });
    }, [invoices, companyId, searchQuery]);

    return (
        <>
            <div className="flex gap-3">
                <SearchProducts 
                    placeholder="Search your products" 
                    onSearch={handleSearch}
                />
            </div>
            <div className="mt-5">
                <InvoiceShowsPage link="pengecekkan-barang" invoice={filteredInvoices}/>
            </div>
        </>
    )
}

export default PengecekkanBarang