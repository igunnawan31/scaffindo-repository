'use client'

import { useEffect, useState } from "react";
import invoicePenjualan from "@/app/data/invoicePenjualan";
import Pagination from "../../admincomponents/Pagination";
import { usePenjualan } from "@/app/hooks/usePenjualan";
import { useProduct } from "@/app/hooks/useProduct";

const HistoryPenjualan = () => {
    const { fetchHistories, histories} = usePenjualan();
    const { fetchProductByLabelId } = useProduct();

    const [productDetails, setProductDetails] = useState<Record<string, any>>({});
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

    useEffect(() => {
        fetchHistories();
    }, []);

     useEffect(() => {
        if (histories.length === 0) return;
        (async () => {
            setLoadingDetails(true);
            const cache: Record<string, any> = { ...productDetails };

            for (const history of histories) {
                for (const labelId of history.labelIds) {
                    if (!cache[labelId]) {
                        const product = await fetchProductByLabelId(labelId);
                        cache[labelId] = product;
                    }
                }
            }

            setProductDetails(cache);
            setLoadingDetails(false);
        })();
    }, [histories]);

    const displayedHistories = histories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">📜 History Penjualan</h2>
            {histories.length > 0 ? (
                <div className="space-y-4">
                    {displayedHistories.map((history) => (
                        <div
                            key={history.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-semibold">#{history.id}</p>
                                <span className="text-sm text-gray-500">{formatDate(history.createdAt)}</span>
                            </div>

                            <ul className="mt-2 space-y-1">
                                {history.labelIds.map((labelId) => {
                                    const product = productDetails[labelId];
                                    if (!product) return <li key={labelId}>Loading...</li>;

                                    return (
                                        <li key={labelId} className="flex justify-between text-sm text-gray-600 border-b pb-1">
                                            <span>{product.productName} ({labelId})</span>
                                            <span>{formatCurrency(product.harga)}</span>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="flex justify-between items-center mt-3 font-semibold">
                                <span>Total</span>
                                <span>{formatCurrency(history.totalHarga)}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">💳 {history.paymentMethod}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">Belum ada penjualan</p>
            )}
            {displayedHistories.length > 0 && (
                <div className="mt-4 w-full">
                    <Pagination
                        totalItems={histories.length}
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
    )
}

export default HistoryPenjualan