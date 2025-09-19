"use client"

import SearchProducts from "../../admincomponents/SearchProducts"
import CategoryProducts from "../../admincomponents/CategoryProducts";
import ProductShows from "../../admincomponents/ProductShows";
import dummyProducts from "@/app/data/productsData";
import { useState } from 'react';

const PrintLabelPage = () => {
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
                <ProductShows title="Recently Printed" products={dummyProducts} limit={3} />
                <ProductShows title="All Products" products={dummyProducts} defaultItemsPerPage={10} />
            </div>
        </>
    )
}

export default PrintLabelPage