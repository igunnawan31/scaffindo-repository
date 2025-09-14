"use client"

import ProductShows from "../print-label/printlabelcomponents/ProductShows";
import dummyProducts from "@/app/data/productsData";
import SearchProducts from "../print-label/printlabelcomponents/SearchProducts";
import CategoryProducts from "../print-label/printlabelcomponents/CategoryProducts";
import { useState } from "react";
import InvoiceShowsPage from "../pengecekkan-barang/pengecekkanbarangcomponents/invoiceShows";


const PengirimanBarang = () => {
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
                <InvoiceShowsPage />
            </div>
        </>
    )
}

export default PengirimanBarang