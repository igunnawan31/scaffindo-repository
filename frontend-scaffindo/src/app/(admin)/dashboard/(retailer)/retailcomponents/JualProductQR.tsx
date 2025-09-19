"use client";

import { useState } from "react";
import ScanProductAdmin from "../../admincomponents/ScanProductAdmin";
import ScanInvoiceModal from "../../admincomponents/ScanInvoiceModal";
import invoiceProducts from "@/app/data/invoiceProducts";
import SuccessModal from "../../admincomponents/SuccessPopUpModal";

type Product = {
  code: string;
  name: string;
  qty: number;
  price: number;
};

const JualProductQR = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [openScanner, setOpenScanner] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const getProductByQr = (code: string) => {
        for (const product of invoiceProducts) {
            const label = product.labels.find(
                (l) => l.qrCode === code || l.id === code
            );
            if (label) {
                return {
                    code: label.id,
                    name: product.name,
                    price: product.harga,
                };
            }
        }
        return null;
    };

    const handleProductScan = (qr: string) => {
        const found = getProductByQr(qr);
        if (!found) {
            alert(`Produk dengan kode ${qr} tidak ditemukan!`);
            return;
        }

        setProducts((prev) => {
            const existing = prev.find((p) => p.code === qr);
            if (existing) {
                return prev.map((p) =>
                p.code === qr ? { ...p, qty: p.qty + 1 } : p
                );
            }
            return [...prev, { ...found, qty: 1 }];
        });
        setOpenScanner(false);
    };

    const handleRemove = (code: string) => {
        setProducts((prev) => prev.filter((p) => p.code !== code));
    };

    const handleCheckout = () => {
        const total = products.reduce((acc, p) => acc + p.qty * p.price, 0);

        setSuccessMessage(
            `Checkout berhasil! Total: Rp ${total.toLocaleString("id-ID")}`
        );
        setShowSuccess(true);
        setProducts([]);
    };

    const totalHarga = products.reduce((acc, p) => acc + p.qty * p.price, 0);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Penjualan dengan QR Code</h2>

            <button
                onClick={() => setOpenScanner(true)}
                className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 mb-4"
            >
                + Scan Produk
            </button>

            {products.length > 0 ? (
                <div className="space-y-3">
                    {products.map((p) => (
                        <div
                            key={p.code}
                            className="flex justify-between items-center border p-3 rounded-lg shadow-sm"
                        >
                        <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-gray-400">Kode: {p.code}</p>
                            <p className="text-sm text-gray-500">
                                Qty: {p.qty} × Rp {p.price.toLocaleString("id-ID")}
                            </p>
                            <p className="text-sm text-green-700 font-semibold">
                                Subtotal: Rp {(p.qty * p.price).toLocaleString("id-ID")}
                            </p>
                        </div>
                            <button
                                onClick={() => handleRemove(p.code)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-400"
                            >
                                Hapus
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-between items-center border-t pt-3 mt-3 font-bold text-lg">
                        <span>Total</span>
                        <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="w-full py-3 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-500"
                    >
                        Checkout
                    </button>
                </div>
            ) : (
                <p className="text-gray-500 text-center">Belum ada produk ditambahkan</p>
            )}

            <ScanInvoiceModal isOpen={openScanner} onClose={() => setOpenScanner(false)}>
                <ScanProductAdmin onProductCode={handleProductScan} />
            </ScanInvoiceModal>

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                title="Checkout Sukses"
                message={successMessage}
            />
        </div>
    );
};

export default JualProductQR;
