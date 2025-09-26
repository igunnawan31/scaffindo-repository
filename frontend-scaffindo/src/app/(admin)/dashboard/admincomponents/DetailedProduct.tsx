import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import dummyProducts from "@/app/data/productsData";
import { useEffect, useState } from "react";
import dummyDistributors from "@/app/data/distributorData";
import { useProduct } from "@/app/hooks/useProduct";
import getImageUrl from "@/app/lib/path";
import { Product } from "@/app/type/types";
interface DetailedProductProps {
    productId: string;
}

export default function DetailedProduct({ productId }: DetailedProductProps) {
    const { fetchProductById, product } = useProduct();
    const [formData, setFormData] = useState({
        totalPieces: "",
        distributor: "",
        penanggungjawab: "Aldisar Gibran",
    });

    useEffect(() => {
        if (productId) {
            fetchProductById(productId);
        }
    }, [productId, fetchProductById])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Printing Label with Data:
        - Total Pieces: ${formData.totalPieces}
        - Distributor: ${formData.distributor}
        - Penanggung Jawab: ${formData.penanggungjawab}`);
    };

    if (!product) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold text-red-500">Product not found</h1>
            </div>
        );
    }
    return (
        <div className="w-full">
            <div className="w-full py-5 block md:flex gap-5 rounded-lg overflow-hidden">
                <div className="md:w-1/2 w-full relative h-[24rem]">
                    <Image
                        src={getImageUrl(product.image[product.image.length - 1].path)}
                        alt={product.image[product.image.length - 1]?.filename ?? "Product image"}
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                <div className="mt-6 md:mt-0 md:w-1/2 w-full p-4 bg-gray-200 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-blue-900">{product.name}</h1>
                    <p className="text-gray-700 mt-2">{product.description}</p>
                </div>
            </div>
            <div className="w-full gap-5 py-5">
                <h2 className="text-xl font-bold text-blue-900 mb-5">Print Label Form</h2>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="totalPieces" className="block font-semibold text-blue-900 mb-1">Total Pieces</label>
                        <input
                            type="number"
                            id="totalPieces"
                            value={formData.totalPieces}
                            onChange={handleChange}
                            placeholder="10 / 100 / 200"
                            className={`w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2 `}
                            // ${errors.email ? 'focus:ring-red-400 border border-red-400' : 'focus:ring-red-400'} error
                        />
                        {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>} */}
                    </div>
                    <div>
                        <label htmlFor="distributor" className="block font-semibold text-blue-900 mb-1">Pick The Distributor</label>
                        <select
                            id="distributor"
                            value={formData.distributor}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-full bg-white text-sm shadow-md focus:outline-none focus:ring-2"
                        >
                            <option value="">-- Select Distributor --</option>
                            {dummyDistributors.map((dist) => (
                                <option key={dist.id} value={dist.name}>
                                    {dist.name}
                                </option>
                            ))}
                        </select>
                        {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>} */}
                    </div>
                    <div>
                        <label htmlFor="penanggungjawab" className="block font-semibold text-blue-900 mb-1">Penanggung Jawab</label>
                        <input
                            type="text"
                            id="penanggungjawab"
                            value={formData.penanggungjawab}
                            placeholder="Aldisar Gibran"
                            className={`w-full px-4 py-3 rounded-full bg-gray-200 text-sm shadow-md focus:outline-none focus:ring-2 `}
                            disabled
                            // ${errors.email ? 'focus:ring-red-400 border border-red-400' : 'focus:ring-red-400'} error
                        />
                        {/* {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>} */}
                    </div>
                </form>
            </div>
            
            <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                Print Label
            </button>
        </div>
    )
}
