"use client";

import invoiceProducts from "@/app/data/invoiceProducts";
import Image from "next/image";

type Props = { productId: number };

export default function CertificationDetails({ productId }: Props) {
    const product = invoiceProducts.find((p) => p.id === productId);

    if (!product) {
        return (
            <div className="p-6">
                <h2 className="text-red-500 font-bold">Product not found</h2>
            </div>
        );
    }

    return (
        <div className="mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-4">
            <Image
                src={product.image}
                width={80}
                height={80}
                alt={product.name}
                className="rounded"
            />
            <div>
                <h1 className="text-2xl font-bold text-blue-900">{product.labels[0].id}</h1>
                <p className="text-gray-600">{product.description}</p>
            </div>
        </div>

        <div className="mt-6">
            <h3 className="font-semibold text-lg">Certification</h3>
            {product.certification && product.certification.length > 0 ? (
                <div className="mt-3 grid grid-cols-3 gap-4">
                    {product.certification.map((cert, index) => (
                        <div
                            key={index}
                            className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <p className="font-semibold text-blue-800">
                                {cert.certificationName}
                            </p>
                            <p className="text-sm text-gray-600">
                                ID: {cert.certificationId}
                            </p>
                            <p className="text-sm text-gray-600">
                                Expired:{" "}
                            <span
                                className={
                                    new Date(cert.certificationExpired) < new Date()
                                        ? "text-red-500 font-semibold"
                                        : "text-green-600 font-semibold"
                                    }
                            >
                                {new Date(cert.certificationExpired).toLocaleDateString(
                                    "id-ID",
                                    { year: "numeric", month: "long", day: "numeric" }
                                )}
                            </span>
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
            <p className="text-gray-500 mt-2">
                No certifications found for this product.
            </p>
            )}
        </div>
        </div>
    );
}
