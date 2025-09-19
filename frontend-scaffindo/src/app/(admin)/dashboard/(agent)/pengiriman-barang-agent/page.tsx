"use client"

import ProductShows from "../../admincomponents/ProductShows";
import dummyProducts from "@/app/data/productsData";
import SearchProducts from "../../admincomponents/SearchProducts";
import CategoryProducts from "../../admincomponents/CategoryProducts";
import { useState } from "react";
import InvoiceShowsPage from "../../admincomponents/invoiceShows";

const PengirimanBarangAgent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <>
            <div className="flex gap-3">
                <CategoryProducts />
                <SearchProducts 
                    placeholder="Search your products" 
                    onSearch={handleSearch}
                />
            </div>
            <div className="mt-5">
                <InvoiceShowsPage link="pengiriman-barang-distributor" />
            </div>
        </>
    )
}

export default PengirimanBarangAgent