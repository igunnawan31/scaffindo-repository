'use client'

import { IoCheckmarkCircle } from "react-icons/io5"
import { motion, Variants } from 'framer-motion'
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTrackings } from "@/app/hooks/useTrackings";
import { useProduct } from "@/app/hooks/useProduct";
import { useLabels } from "@/app/hooks/useLabels";

const leftVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const rightVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

interface Props {
    labelId: string;
}

const JourneyProduct: React.FC<Props> = ({labelId}) => {
    const { fetchTrackingById } = useTrackings();
    const [trackingData, setTrackingData] = useState<any[]>([]);
    const { fetchLabelById } = useLabels();
    const [label, setLabel] = useState<any | null>(null);

    useEffect(() => {
        if (!labelId) return;

        fetchTrackingById(labelId).then((data) => {
            if (Array.isArray(data)) {
                const sorted = [...data].sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
                setTrackingData(sorted);
            }
        });

        if (labelId) fetchLabelById(labelId);
    }, [labelId, fetchTrackingById, fetchLabelById]);

    console.log(label)
    if (trackingData.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold text-red-500">
                    Data tracking tidak ditemukan untuk kode "{labelId}"
                </h1>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-gray-200 rounded-lg pb-12">
            <div className="text-center mb-8">
                <h2 className="text-blue-900 text-2xl font-bold flex items-center justify-center gap-2">
                    {labelId}
                </h2>
                <p className="text-gray-500">
                    Dilacak secara transparan menggunakan teknologi blockchain
                </p>
                <span className="inline-block mt-3 px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    100% Verified on Blockchain
                </span>
            </div>

            <div className="md:hidden relative">
                <div className="absolute left-8 top-0 w-1 h-full bg-yellow-500"></div>
                {trackingData.map((track) => (
                    <motion.div 
                        key={track.id}
                        className="flex mb-12 last:mb-0"
                        initial='hidden'
                        whileInView={'visible'}
                        viewport={{ once: true, amount: 0.3 }}
                        variants={leftVariants}
                    >
                        <div className="flex-shrink-0 w-16 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full relative z-10">
                                {/* {journey.icon} */}
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="bg-white shadow-md rounded-lg p-5">
                                <h3 className="font-semibold text-lg">{track.title}</h3>
                                <p className="text-sm text-gray-500">{new Date(track.createdAt).toLocaleString()}</p>
                                <ul className="mt-3 text-gray-700 text-sm space-y-1">
                                    {track.description}
                                </ul>
                                <div className="mt-3 text-xs text-blue-900 bg-blue-100 p-2 rounded">
                                    <IoCheckmarkCircle className="w-4 h-4 inline mr-1" />
                                    Verified | Blockchain Record
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Desktop Layout (md and above) */}
            <div className="hidden md:relative md:grid md:grid-cols-9 md:gap-y-12">
                <div className="absolute left-1/2 top-0 w-1 -translate-x-1/2 h-full bg-yellow-500"></div>
                {trackingData.map((track, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <div key={track.id} className="contents">
                            {isLeft ? (
                                <motion.div 
                                    className="col-span-4 pr-6"
                                    initial='hidden'
                                    whileInView={'visible'}
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={leftVariants}
                                >
                                    <div className="bg-white shadow-md rounded-lg p-5">
                                        <h3 className="font-semibold text-lg">{track.title}</h3>
                                        <p className="text-sm text-gray-500">{new Date(track.createdAt).toLocaleString()}</p>
                                        <ul className="mt-3 text-gray-700 text-sm space-y-1">
                                            {track.description}
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
                                    {/* {journey.icon} */}
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
                                        <h3 className="font-semibold text-lg">{track.title}</h3>
                                        <p className="text-sm text-gray-500">{new Date(track.createdAt).toLocaleString()}</p>
                                        <ul className="mt-3 text-gray-700 text-sm space-y-1">
                                            {track.description}
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
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center pt-10"> 
                <Link
                    href={`/scan-product/${label?.productId || null}`}
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
            </div>
        </div>
    )
}

export default JourneyProduct