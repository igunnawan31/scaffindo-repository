"use client"

import SearchProducts from "../../admincomponents/SearchProducts"
import CategoryProducts from "../../admincomponents/CategoryProducts";
import ProductShows from "../../admincomponents/ProductShows";
import dummyProducts from "@/app/data/productsData";
import { useEffect, useMemo, useState } from 'react';
import { useProduct } from "@/app/hooks/useProduct";
import { Category, Product } from "@/app/type/types";

const PrintLabelPage = () => {
    const { fetchProducts, products } = useProduct();
    const [searchQuery, setSearchQuery] = useState("");
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const loggedInUser = JSON.parse(userStr);
            if (loggedInUser?.companyId) {
                setCompanyId(loggedInUser.companyId);
            }
        }
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((p: Product) => {
            const matchCompany = p.companyId === companyId;
            const matchSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = !selectedCategory || selectedCategory === "all" || p.category.includes(selectedCategory);

            return matchCompany && matchSearch && matchCategory;
        });
    }, [products, companyId, searchQuery, selectedCategory]);

    return (
        <>
            <div className="flex gap-3">
                <CategoryProducts
                    filters={[
                        {
                            type: "category",
                            label: "Category",
                            options: [
                                { label: "All", value: "all" },
                                ...Object.values(Category)
                                    .filter((c) => typeof c === "string")
                                    .map((c) => ({
                                        label: c,
                                        value: c,
                                    })) as { label: string; value: string }[],
                            ],
                        },
                    ]}
                    onSelect={(type, value) => {
                        if (type === "category") {
                            setSelectedCategory(value);
                        }
                    }}
                />
                <SearchProducts 
                    placeholder="Search your products" 
                    onSearch={handleSearch}
                />
            </div>
            <div className="mt-5">
                <ProductShows title="Recently Printed" products={filteredProducts} limit={3} />
                <ProductShows title="All Products" products={filteredProducts} defaultItemsPerPage={10} />
            </div>
        </>
    )
}

export default PrintLabelPage