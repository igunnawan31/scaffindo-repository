"use client";

import invoiceProducts from "@/app/data/invoiceProducts";
import { useCertificate } from "@/app/hooks/useCertificate";
import { useProduct } from "@/app/hooks/useProduct";
import { getPDFUrl } from "@/app/lib/path";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = { productId: string };

export default function CertificationDetails({ productId }: Props) {
    const { fetchCertificateByProductId,  certificate, fetchCertificateById } = useCertificate();
    const [certifications, setCertifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [certificationDocs, setCertificationDocs] = useState<File | null>(null);

    useEffect(() => {
        if (!productId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchCertificateByProductId(productId);
                console.log(data);
                setCertifications(data || []);
            } catch (err: any) {
                setError(err.message || "Failed to fetch certifications");
                setCertifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [productId, fetchCertificateByProductId]);

    useEffect(() => {
        if (certificate?.id) fetchCertificateById(certificate?.id);
    }, [fetchCertificateById]);

    return (
        <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="mt-6">
                <h3 className="font-semibold text-lg text-gray-800">Certification</h3>

                {certifications.length > 0 ? (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert, index) => (
                        <div
                        key={index}
                        className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
                        >
                        <div>
                            <p className="font-bold text-lg text-blue-900">{cert.name}</p>
                            <p className="text-sm text-gray-500">ID: {cert.id}</p>
                            <p className="text-sm text-gray-600 mt-1">{cert.details}</p>

                            <p className="text-sm mt-2">
                            <span className="text-gray-500">Expired:</span>{" "}
                            <span
                                className={`font-semibold ${
                                    new Date(cert.expired) < new Date()
                                        ? "text-red-500"
                                        : "text-green-600"
                                }`}
                            >
                                {new Date(cert.expired).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            </p>
                        </div>

                        {cert?.document?.[0]?.path && (
                            <a
                                href={getPDFUrl(cert.document[0].path)}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                            Download Document
                            </a>
                        )}
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2">No certifications found for this product.</p>
                )}
                </div>
        </div>
    );
}
