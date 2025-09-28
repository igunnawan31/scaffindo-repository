"use client"

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { Label } from "@/app/type/types";
import QRCode from "qrcode";

type LabelShowsPageProps = {
    label: Label[];
    link: string;
};

const ProductRetailsPage: React.FC<LabelShowsPageProps> = ({
    label,
    link,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});

    const displayedLabels = label.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [label]);

    useEffect(() => {
        displayedLabels.forEach((label) => {
            if (!qrDataUrls[label.id]) {
                QRCode.toDataURL(label.id).then((url) => {
                    setQrDataUrls((prev) => ({ ...prev, [label.id]: url }));
                });
            }
        });
    }, [displayedLabels, qrDataUrls]);

    return (
        <div className="flex flex-col gap-4 w-full">
            {displayedLabels.map((label) => (
                <Link key={label.id} className="w-full bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition" href={`/dashboard/${link}/${label.id}`} >
                    <div className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Label Product</span>
                                <span className="text-gray-400">{label.id}</span>
                            </div>
                            <div className="text-blue-900">
                                {label.status}
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <Image
                                src={qrDataUrls[label.id] || "/placeholder.png"}
                                alt="QR Code"
                                width={80}
                                height={80}
                                unoptimized
                                className="rounded-md object-cover"
                            />
                            <div className="flex-1">
                                <h2 className="font-semibold text-blue-900">
                                    {label.id}
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">QR Label</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center border-t pt-3">
                            <div className="text-blue-900 font-medium text-sm hover:underline">
                                Lihat Detail Label
                            </div>
                        </div>   
                    </div>                 
                </Link>
            ))}

            {label.length > 0 ? (
                <div className="mt-4 w-full">
                    <Pagination
                        totalItems={label.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onItemsPerPageChange={(items) => {
                            setItemsPerPage(items);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">Tidak ada label untuk kategori ini.</p>
            )}
        </div>
    );
};

export default ProductRetailsPage;
