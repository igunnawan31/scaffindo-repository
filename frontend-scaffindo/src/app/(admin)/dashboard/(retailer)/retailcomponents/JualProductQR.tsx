"use client";

import { useEffect, useState } from "react";
import ScanProductAdmin from "../../admincomponents/ScanProductAdmin";
import ScanInvoiceModal from "../../admincomponents/ScanInvoiceModal";
import SuccessModal from "../../admincomponents/SuccessPopUpModal";
import { useLabels } from "@/app/hooks/useLabels";
import { useProduct } from "@/app/hooks/useProduct";
import axios from "axios";
import ErrorPopUpModal from "../../admincomponents/ErrorPopUpModal";

type SelectedProduct = {
    code: string;
    name: string;
    qty: number;
    price: number;
};

const JualProductQR = () => {
    const { fetchLabelsPenjualan, penjualan, bulkBuy } = useLabels();
    const { fetchProductById, product } = useProduct(); 
    const [cart, setCart] = useState<SelectedProduct[]>([]);
    const [openScanner, setOpenScanner] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingPenjualan, setLoadingPenjualan] = useState(true);

    useEffect(() => {
        const load = async () => {
            await fetchLabelsPenjualan();
            setLoadingPenjualan(false);
        };
        load();
    }, [fetchLabelsPenjualan]);

    const handleProductScan = async (qr: string) => {
        const cleanQr = qr.trim();

        if (loadingPenjualan) {
            setErrorMessage("Data label belum siap, tunggu sebentar.");
            setShowError(true);
            return;
        }

        const label = penjualan.find((l) => l.id === cleanQr);
        
        if (!label) {
            setErrorMessage(`Label dengan kode ${qr} tidak ditemukan atau belum bisa dijual.`);
            setShowError(true);
            return;
        }

        const productData = await fetchProductById(label.productId);

        if (!productData) {
            setErrorMessage("Produk terkait label ini tidak ditemukan!");
            setShowError(true);
            return;
        }

        setCart((prev) => {
            const existing = prev.find((p) => p.code === label.id);
            if (existing) {
                return prev.map((p) =>
                    p.code === label.id ? { ...p, qty: p.qty + 1 } : p
                );
            }
            return [
                ...prev,
                {
                    code: label.id,
                    name: productData.name,
                    price: Number(productData.price),
                    qty: 1,
                },
            ];
        });

        setOpenScanner(false);
    };

    const handleRemove = (code: string) => {
        setCart((prev) => prev.filter((p) => p.code !== code));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            setErrorMessage("Keranjang Kosong");
            setShowError(true);
            return;
        }

        try {
            setLoading(true);
            const labelIds = cart.map(item => item.code);
            const totalAmount = cart.reduce((acc, p) => acc + p.qty * p.price, 0);
            
            const payload = {
                title: `Bulk Purchase - ${new Date().toLocaleString()}`,
                description: `Pembelian ${cart.length} produk dengan total Rp ${totalAmount.toLocaleString("id-ID")}`,
                paymentMethod: "CASH",
                labelIds: labelIds,
                status: "PURCHASED_BY_CUSTOMER"
            };

            const result = await bulkBuy(payload);
            setSuccessMessage(`Checkout berhasil! Total: Rp ${totalAmount.toLocaleString("id-ID")}`);
            setShowSuccess(true);
            setCart([]);
            fetchLabelsPenjualan();
        } catch (err) {
            setErrorMessage("Tidak Berhasil Checkout");
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const totalHarga = cart.reduce((acc, p) => acc + p.qty * p.price, 0);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Penjualan dengan QR Code</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <button
                onClick={() => setOpenScanner(true)}
                disabled={loading || loadingPenjualan}
                className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 mb-4 disabled:bg-gray-400"
            >
                {loadingPenjualan ? "Menyiapkan data label..." : (loading ? "Loading..." : "+ Scan Produk")}
            </button>

            {cart.length > 0 ? (
                <div className="space-y-3">
                    {cart.map((p) => (
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
                                disabled={loading}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-400 disabled:bg-gray-400"
                            >
                                Hapus
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-between items-center border-t pt-3 mt-3 font-bold text-lg">
                        <span>Total</span>
                        <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                    </div>


                    <div className="space-y-2 mt-4 border p-3 rounded-lg">
                        <label className="block text-sm font-medium">Judul Transaksi</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Pembelian Harian / Transaksi #123"
                            className="w-full border p-2 rounded"
                        />

                        <label className="block text-sm font-medium">Deskripsi</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Catatan opsional..."
                            className="w-full border p-2 rounded"
                        />

                        <label className="block text-sm font-medium">Metode Pembayaran</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="CASH">Cash</option>
                            <option value="QRIS">QRIS</option>
                            <option value="TRANSFER">Transfer Bank</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading || cart.length === 0}
                        className="w-full py-3 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:bg-gray-400"
                    >
                        {loading ? "Processing..." : "Checkout"}
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
            <ErrorPopUpModal
                isOpen={showError}
                onClose={() => setShowError(false)}
                title="User Gagal dibuat"
                message={errorMessage}
            />
        </div>
    );
};

export default JualProductQR;