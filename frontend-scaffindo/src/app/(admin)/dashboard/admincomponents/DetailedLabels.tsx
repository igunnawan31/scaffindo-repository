"use client";

import { useEffect, useState } from "react";
import { useTrackings } from "@/app/hooks/useTrackings";
import Image from "next/image";
import QRCode from "qrcode";

type Props = { 
    labelId: string;
}

const DetailedLabels = ({ labelId }: Props) => {
    const { fetchTrackingById } = useTrackings();
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [trackingData, setTrackingData] = useState<any[]>([]);

    useEffect(() => {
        if (labelId) {
            QRCode.toDataURL(labelId).then(setQrDataUrl);
            fetchTrackingById(labelId).then((data) => {
                if (Array.isArray(data)) {
                    const sorted = [...data].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setTrackingData(sorted);
                }
            });
        }
    }, [labelId]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full">
            <div className="w-full py-5 block md:flex gap-5 rounded-lg overflow-hidden">
                <div className="md:w-1/2 w-full relative h-[24rem]">
                    <Image
                        src={qrDataUrl || "/placeholder.png"}
                        alt="QR Code"
                        width={300}
                        height={300} 
                        unoptimized 
                        className="mx-auto"
                    />
                </div>
                <div className="md:w-1/2 w-full mt-5 md:mt-0 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mt-4">Detail Label: {labelId}</h1>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold mt-6">Riwayat Tracking</h2>
                    {trackingData.length > 0 ? (
                        <ul className="mt-2 space-y-2">
                            {trackingData.map((track) => (
                                <li key={track.id} className="border p-3 rounded-md">
                                    <p><strong>• {track.status}</strong></p>
                                    <p>Perusahaan: {track.companyId}</p>
                                    <p>Tanggal: {new Date(track.createdAt).toLocaleString()}</p>
                                    <p>Deskripsi: {track.description}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-2">Belum ada tracking.</p>
                    )}
            </div>
        </div>
    );
};

export default DetailedLabels;
