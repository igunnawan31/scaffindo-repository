import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface Props {
    onLabelCode: (code: string) => void;
}

const ScanProduct:React.FC<Props> = ({onLabelCode}) => {
    const [mode, setMode] = useState<"camera" | "code">("camera");
    const [labelId, setLabelId] = useState<string>("");
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
        const toggleScanner = async () => {
            if (!scannerRef.current || isTransitioningRef.current) return;

            isTransitioningRef.current = true;

            if (mode === "camera") {
                if (isScanningRef.current) {
                    await scannerRef.current.stop().catch(() => {});
                    isScanningRef.current = false;
                }

                try {
                    await scannerRef.current.start(
                        { facingMode: "environment" },
                        { fps: 20 },
                        (decodedText) => {
                            onLabelCode(decodedText);
                            if (isScanningRef.current) {
                                scannerRef.current?.stop().finally(() => {
                                    isScanningRef.current = false;
                                });
                            }
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

        toggleScanner();
    }, [mode, onLabelCode]);

    return (
        <div className='mt-10 flex flex-col lg:flex-row gap-6'>
            <div className='lg:w-1/2 w-full order-1'>
                {mode === "camera" ? (
                    <div className='w-full h-auto bg-black flex items-center justify-center text-white overflow-hidden'>
                        <div id="reader" className="w-full h-auto"></div>
                    </div>
                ) : (
                    <div className="w-full h-auto bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-6">
                        <p className="text-gray-500 mb-4">Enter Product Code</p>
                        <input
                            type="text"
                            value={labelId}
                            onChange={(e) => setLabelId(e.target.value)}
                            placeholder="e.g. KaosPrinting-1"
                            className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-black"
                        />
                        <button
                            onClick={() => onLabelCode(labelId)}
                            className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition cursor-pointer"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
             <div className="lg:w-1/2 w-full order-2 border-2 border-blue-900 border-dashed p-5 rounded-lg mb-6 lg:mb-0">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gray-200 rounded-lg p-5 flex gap-2">
                        {["camera", "code"].map((m) => (
                        <span
                            key={m}
                            className={`cursor-pointer px-4 py-2 rounded-lg ${
                            mode === m
                                ? "bg-blue-900 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                            onClick={() => {
                                setMode(m as typeof mode);
                                if (m === "code") setLabelId("");
                            }}
                        >
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </span>
                        ))}
                    </div>
                </div>
                <div>
                    {mode === "camera" && (
                        <p className="text-black">
                            Use your device camera to scan the product.
                        </p>
                    )}
                    {mode === "code" && (
                        <p className="text-black">
                            Enter the product code manually.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ScanProduct