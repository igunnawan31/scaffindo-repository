'use client'

import UserDummy from "@/app/data/UserDummy"
import Link from "next/link"
import { useEffect, useState } from "react"
import { IoCreateOutline, IoTrashOutline, IoAddCircle } from "react-icons/io5"
import SuccessModal from "../../admincomponents/SuccessPopUpModal"
import CategoryProducts from "../../admincomponents/CategoryProducts"
import SearchProducts from "../../admincomponents/SearchProducts"
import Pagination from "../../admincomponents/Pagination"
import { Company, Product } from "@/app/type/types"
import { useProduct } from "@/app/hooks/useProduct"
import Image from "next/image"
import getImageUrl from "@/app/lib/path"
import { Category } from "@/app/type/types"

const ProductList = () => {
    const { products, fetchProducts, deleteProduct } = useProduct();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = products.filter((product: Product) => {
        const matchSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory =
            !selectedCategory || selectedCategory === "all" || product.category.includes(selectedCategory);
        return matchSearch && matchCategory;
    });

    console.log(filteredProducts.length);

    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    console.log(displayedProducts);

    const handleDelete = async (id: string) => {
        try {
            await deleteProduct(id);
            setSuccessMessage("Product berhasil dihapus");
            setShowSuccess(true);

            await fetchProducts();
        } catch (error: any) {
            setSuccessMessage(error?.response?.data?.message || "Gagal menghapus product");
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
                    placeholder="Search product" 
                    onSearch={handleSearch}
                />
            </div>
            <div className="flex items-center justify-end mt-3">
                <Link
                    href={'/dashboard/list-product/create'}
                    className="w-2/12 flex items-center justify-center gap-2 p-2 bg-blue-900 text-white rounded-lg hover:bg-yellow-600 cursor-pointer text-sm"
                >
                    < IoAddCircle />
                    Create New Product
                </Link>
            </div>
            {displayedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-3">
                    {displayedProducts.map((product) =>
                        <div
                            key={product.id}
                            className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                        >
                            <Image
                                src={getImageUrl(product.image[product.image.length - 1].path)}
                                alt={product.image[product.image.length - 1]?.filename ?? "Product image"}
                                width={400}
                                height={200}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-5">
                                <div className="flex justify-between">
                                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.name}</h2>
                                    <h3 className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.price}</h3>
                                </div>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.description}</p>
                                <div className="flex items-end justify-end gap-2 md:gap-2">
                                    <Link
                                        href={`/dashboard/list-product/${product.id}/update`}
                                        className="flex items-center gap-2 p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
                                    >
                                        <IoCreateOutline size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)} 
                                        className="flex items-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                                    >
                                        <IoTrashOutline size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ): (
                <p className="text-gray-500 text-center">Belum ada product</p>
            )}
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Delete Sukses"
                message={successMessage}
            />
            <div className="mt-4 w-full">
                <Pagination
                    totalItems={filteredProducts.length}
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

export default ProductList