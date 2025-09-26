"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import Link from "next/link";
import { Product } from "@/app/type/types";
import getImageUrl from "@/app/lib/path";

type ProductShowsProps = {
    title: string;
    products: Product[];
    limit?: number;
    defaultItemsPerPage?: number;
};

const ProductShows: React.FC<ProductShowsProps> = ({ title, products, limit, defaultItemsPerPage = 10}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
    const displayedProducts = limit
        ? products.slice(0, limit)
        : products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    console.log(displayedProducts);

    return (
        <div className="flex flex-col justify-center items-start gap-3 overflow-hidden py-2 w-full">
            <h2 className="text-md font-bold text-blue-900">{title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {displayedProducts.map((product) => (
                    <Link
                        href={`/dashboard/print-label/${product.id}`}
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
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{product.description}</p>
                            <div className="inline-flex items-center px-3 py-2 gap-2 text-sm font-medium text-center text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Print Label
                                <Image 
                                    src={'/assets/icons/print.svg'}
                                    width={20}
                                    height={20}
                                    alt="Print" 
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {!limit && (
                <div className="mt-4 w-full">
                    <Pagination
                        totalItems={products.length}
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
        </div>
    );
};

export default ProductShows;
