'use client'

import journeyData from "@/app/data/journeyData"
import { IoCheckmarkCircle } from "react-icons/io5"
import { motion, Variants } from 'framer-motion'
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import invoiceProducts from "@/app/data/invoiceProducts";
import React, { useEffect, useState } from "react";

const leftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const rightVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface Props {
    productCode: string;
}

const JourneyProduct: React.FC<Props> = ({productCode}) => {
    const product = invoiceProducts.find((p) =>
        p.labels.some(
        (label) =>
            label.id.toLowerCase() === productCode.toLowerCase() ||
            label.qrCode.toLowerCase() === productCode.toLowerCase()
        )
    );

    const label = product?.labels.find(
        (label) =>
        label.id.toLowerCase() === productCode.toLowerCase() ||
        label.qrCode.toLowerCase() === productCode.toLowerCase()
    );

    if (!product || !label) {
        return (
        <div className="p-6">
            <h1 className="text-xl font-bold text-red-500">
                Produk tidak ditemukan untuk kode "{productCode}"
            </h1>
        </div>
        );
    }

    const productJourney = label.journey || [];

    return (
        <div className="w-full p-6 bg-gray-200 rounded-lg mb-12">
            <div className="text-center mb-8">
                <h2 className="text-blue-900 text-2xl font-bold flex items-center justify-center gap-2">
                    {product.labels[0].id}
                </h2>
                <p className="text-gray-500">
                    Dilacak secara transparan menggunakan teknologi blockchain
                </p>
                <span className="inline-block mt-3 px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    100% Verified on Blockchain
                </span>
            </div>

            <div className="relative grid grid-cols-9 gap-y-12">
                <div className="absolute left-1/2 top-0 w-1 -translate-x-1/2 h-full bg-yellow-500"></div>
                {productJourney.map((journey, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <div key={journey.id} className="contents">
                            {isLeft ? (
                                <motion.div 
                                    className="col-span-4 pr-6"
                                    initial='hidden'
                                    whileInView={'visible'}
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={leftVariants}
                                >
                                    <div className="bg-white shadow-md rounded-lg p-5">
                                        <h3 className="font-semibold text-lg">{journey.title}</h3>
                                        <p className="text-sm text-gray-500">{journey.date}</p>
                                        <ul className="mt-3 text-gray-700 text-sm space-y-1">
                                            {journey.details.map((d, i) => (
                                                <li key={i}>• {d}</li>
                                            ))}
                                        </ul>
                                        <div className="mt-3 text-xs text-blue-900 bg-blue-100 p-2 rounded">
                                            <IoCheckmarkCircle className="w-4 h-4 inline mr-1" />
                                            Verified | Blockchain Record
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="col-span-4" />
                            )}

                            <div className="col-span-1 flex flex-col items-center">
                                <div className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full relative z-10">
                                    {journey.icon}
                                </div>
                            </div>

                            {!isLeft ? (
                                <motion.div 
                                    className="col-span-4 pr-6"
                                    initial='hidden'
                                    whileInView={'visible'}
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={rightVariants}
                                >
                                    <div className="bg-white shadow-md rounded-lg p-5">
                                        <h3 className="font-semibold text-lg">{journey.title}</h3>
                                        <p className="text-sm text-gray-500">{journey.date}</p>
                                        <ul className="mt-3 text-gray-700 text-sm space-y-1">
                                            {journey.details.map((d, i) => (
                                                <li key={i}>• {d}</li>
                                            ))}
                                        </ul>
                                        <div className="mt-3 text-xs text-blue-900 bg-blue-100 p-2 rounded">
                                            <IoCheckmarkCircle className="w-4 h-4 inline mr-1" />
                                            Verified | Blockchain record
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="col-span-4" />
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-center pt-10"> 
                <Link
                    href={`/scan-product/${product?.id ?? ""}`}
                    className="group p-5 bg-blue-900 border-2 border-blue-900 text-white 
                        hover:bg-white hover:border-blue-900 hover:text-blue-900
                        rounded-lg font-semibold mx-3 flex items-center"
                >
                    Certification
                    <Image
                        src="/assets/icons/qrcode.svg"
                        width={20}
                        height={20}
                        alt="Qr Code"
                        className="ml-3 block group-hover:hidden"
                    />
                    <Image
                        src="/assets/icons/qrcode-blue.svg"
                        width={20}
                        height={20}
                        alt="Qr Code Blue"
                        className="ml-3 hidden group-hover:block"
                    />
                </Link>
                <Link 
                    href={`/scan-product/${product?.id ?? ""}`}
                    className="group p-5 bg-white border-2 border-white text-blue-900 
                        hover:bg-blue-900 hover:border-white hover:text-white
                        rounded-lg font-semibold mx-3 flex items-center"
                >
                    Know More About Us
                    <Image
                        src="/assets/icons/info-blue.svg"
                        width={20}
                        height={20}
                        alt="Info Blue"
                        className="ml-3 block group-hover:hidden"
                    />
                    <Image
                        src="/assets/icons/info-white.svg"
                        width={20}
                        height={20}
                        alt="Info White"
                        className="ml-3 hidden group-hover:block"
                    />
                </Link>
            </div>
        </div>
    )
}

export default JourneyProduct