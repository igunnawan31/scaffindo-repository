import React, { useEffect, useState } from 'react'
import Webcam from "react-webcam";

const ScanProduct = () => {
    const [mode, setMode] = useState<"camera" | "upload">("camera");
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

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
                ) : (
                    <div className="w-full h-[32rem] bg-gray-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-400">
                        <p className="text-gray-500 mb-2">Upload Product Image</p>
                        <input
                            type="file"
                            accept="image/*"
                            className="cursor-pointer"
                        />
                    </div>
                )}
            </div>
            <div className='lg:w-1/2 w-full order-2'>
                <div className='flex items-center gap-4 mb-6'>
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
                </div>
                <div>
                    {mode === "camera" ? (
                        <p className="text-gray-700">
                            Use your device camera to scan the product.
                        </p>
                    ) : (
                        <p className="text-gray-700">
                            Upload an image of the product to scan.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ScanProduct