import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface Props {
    onProductCode: (code: string) => void;
}

interface Props {
    onProductCode: (code: string) => void;
    disabled?: boolean;
}

const ScanProductAdmin: React.FC<Props> = ({ onProductCode, disabled = false }) => {
    const [mode, setMode] = useState<"camera" | "code">("camera");
    const [productCode, setProductCode] = useState<string>("");
    const isTransitioningRef = useRef(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isScanningRef = useRef(false);

    useEffect(() => {
        if (scannerRef.current) return;
        scannerRef.current = new Html5Qrcode("reader");

        return () => {
            const cleanupScanner = async () => {
                try {
                    if (isScanningRef.current) {
                        await scannerRef.current?.stop();
                        isScanningRef.current = false;
                    }
                    await scannerRef.current?.clear();
                } catch (err) {
                    console.warn("Cleanup error:", err);
                }
            };

            cleanupScanner();
        };
    }, []);

    useEffect(() => {
    const initScanner = async () => {
        if (!scannerRef.current || isTransitioningRef.current) return;
        isTransitioningRef.current = true;

        if (mode === "camera" && !disabled) {
            const reader = document.getElementById("reader");
            if (!reader || reader.clientWidth === 0) {
                console.warn("Reader not ready, retrying...");
                setTimeout(initScanner, 200);
                isTransitioningRef.current = false;
                return;
            }

            try {
                await scannerRef.current.start(
                    { facingMode: "environment" },
                    { fps: 20 },
                    (decodedText) => {
                        onProductCode(decodedText);
                        scannerRef.current?.stop();
                        isScanningRef.current = false;
                    },
                    (err) => console.warn("QR error:", err)
                );
                isScanningRef.current = true;
            } catch (err) {
                console.error("Failed to start scanner:", err);
            }
        } else {
            if (isScanningRef.current) {
                await scannerRef.current.stop().catch(() => {});
                isScanningRef.current = false;
            }
        }

        isTransitioningRef.current = false;
    };

    initScanner();
}, [mode, onProductCode, disabled]);

    return (
        <div className="mt-10 flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2 w-full order-1">
                {disabled ? (
                    <div className="w-full h-[auto] flex items-center justify-center border border-dashed rounded-lg text-gray-500">
                        Isi form terlebih dahulu untuk scan produk
                    </div>
                ) : mode === "camera" ? (
                    <div className="w-full h-[auto] bg-black flex items-center justify-center text-white">
                        <div id="reader" className="w-full h-[auto]"></div>
                    </div>
                ) : (
                    <div className="w-full h-[auto] bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-6">
                        <p className="text-gray-500 mb-4">Enter Product Code</p>
                        <input
                            type="text"
                            value={productCode}
                            disabled={disabled}
                            onChange={(e) => setProductCode(e.target.value)}
                            placeholder="e.g. KaosPrinting-1"
                            className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                        <button
                            onClick={() => onProductCode(productCode)}
                            disabled={disabled}
                            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
            <div className="lg:w-1/2 w-full order-2 border-2 border-blue-900 border-dashed p-5 rounded-lg">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gray-200 rounded-lg p-5 flex gap-2">
                        {["camera", "code"].map((m) => (
                            <span
                                key={m}
                                className={`cursor-pointer px-4 py-2 rounded-lg ${
                                mode === m ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"
                                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => {
                                if (!disabled) {
                                    setMode(m as typeof mode);
                                    if (m === "code") setProductCode("");
                                }
                                }}
                            >
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    {disabled ? (
                        <p className="text-gray-500">Isi form terlebih dahulu untuk mengaktifkan scanner.</p>
                    ) : mode === "camera" ? (
                        <p className="text-gray-700">Use your device camera to scan the product.</p>
                    ) : (
                        <p className="text-gray-700">Enter the product code manually.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ScanProductAdmin