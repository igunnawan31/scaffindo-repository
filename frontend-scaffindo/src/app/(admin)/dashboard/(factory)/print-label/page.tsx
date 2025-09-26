"use client"

import SearchProducts from "../../admincomponents/SearchProducts"
import CategoryProducts from "../../admincomponents/CategoryProducts";
import ProductShows from "../../admincomponents/ProductShows";
import dummyProducts from "@/app/data/productsData";
import { useEffect, useState } from 'react';
import { useProduct } from "@/app/hooks/useProduct";
import { Product } from "@/app/type/types";

const PrintLabelPage = () => {
    const { fetchProducts, products } = useProduct();
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
                <ProductShows title="Recently Printed" products={products} limit={3} />
                <ProductShows title="All Products" products={products} defaultItemsPerPage={10} />
            </div>
        </>
    )
}

export default PrintLabelPage