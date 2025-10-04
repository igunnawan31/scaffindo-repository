
import { Metadata } from "next";
import ScanProductClient from "./scanproductcomponents/ScanProductClient";

export const metadata: Metadata = {
    title: "Scan Product | ChainTrack",
    description: "Scan and verify product authenticity using blockchain-based QR tracking.",
    icons: {
        icon: "/icon.png" 
    },
    openGraph: {
        title: "Scan Product - ChainTrack",
        description: "Instant product verification powered by blockchain technology.",
        url: "https://chaintrack.id/scan-product",
            images: [
            {
                url: "https://chaintrack.id/assets/icons/sucoffindo.png",
                width: 1200,
                height: 630,
                alt: "ChainTrack QR Scanner",
            },
        ],
    },
    robots: "index,follow",
};

export default function Page() {
    return <ScanProductClient />;
}
