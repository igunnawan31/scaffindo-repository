import React, { useEffect, useState } from 'react'
import Webcam from "react-webcam";

const ScanProduct = () => {
    const [mode, setMode] = useState<"camera" | "upload" | "code">("camera");
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [productCode, setProductCode] = useState<string | null>(null);
    
    useEffect(() => {
        navigator.mediaDevices
        .enumerateDevices()
        .then((mediaDevices) => {
            const videoDevices = mediaDevices.filter(
            (device) => device.kind === "videoinput"
            );
            setDevices(videoDevices);

            if (videoDevices.length > 0 && !selectedDeviceId) {
            setSelectedDeviceId(videoDevices[0].deviceId);
            }
        })
        .catch((err) => {
            console.error("Error getting devices:", err);
        });
    }, [selectedDeviceId]);

    return (
        <div className='mt-10 flex flex-col lg:flex-row gap-6'>
            <div className='lg:w-1/2 w-full order-1'>
                {mode === "camera" ? (
                    <div className='w-full h-[32rem] bg-black rounded-xl flex items-center justify-center text-white'>
                        {selectedDeviceId ? (
                                <Webcam
                                    audio={false}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{
                                    deviceId: selectedDeviceId,
                                    width: 640,
                                    height: 480,
                                    }}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <p>No camera available</p>
                        )}
                    </div>
                ) : mode === "upload" ? (
                    <div className="w-full h-[32rem] bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-400">
                        <p className="text-gray-500 mb-2">Upload Product Image</p>
                        <input
                            type="file"
                            accept="image/*"
                            className="cursor-pointer"
                        />
                    </div>
                ) : (
                    <div className="w-full h-[32rem] bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-400 p-6">
                        <p className="text-gray-500 mb-4">Enter Product Code</p>
                        <input
                            type="text"
                            value={productCode ?? ""}
                            onChange={(e) => setProductCode(e.target.value)}
                            placeholder="e.g. 123456789"
                            className="w-full max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                        />
                        <button
                            onClick={() => alert(`Product Code Entered: ${productCode}`)}
                            className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
            <div className='lg:w-1/2 w-full order-2 border-2 border-blue-900 border-dashed p-5 rounded-lg'>
                <div className='flex items-center gap-4 mb-6'>
                    <div className='bg-gray-200 rounded-lg p-5'>
                        <span
                            className={`cursor-pointer px-4 py-2 rounded-lg ${
                                mode === "camera"
                                    ? "bg-blue-900 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                            onClick={() => setMode("camera")}
                        >
                            Camera
                        </span>
                        <span
                            className={`cursor-pointer px-4 py-2 rounded-lg ${
                                mode === "upload"
                                    ? "bg-blue-900 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                            onClick={() => setMode("upload")}
                        >
                            Upload
                        </span>
                        <span
                            className={`cursor-pointer px-4 py-2 rounded-lg ${
                                mode === "code"
                                    ? "bg-blue-900 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                            onClick={() => setMode("code")}
                        >
                            Code
                        </span>
                    </div>
                </div>
                <div>
                    {mode === "camera" ? (
                        <p className="text-gray-700">
                            Use your device camera to scan the product.
                        </p>
                    ) : mode === "upload" ? (
                        <p className="text-gray-700">
                            Upload an image of the product to scan.
                        </p>
                    ) : (
                        <p className="text-gray-700">
                            Enter the product code manually.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ScanProduct