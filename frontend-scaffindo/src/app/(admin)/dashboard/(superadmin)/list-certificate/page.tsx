import { Metadata } from "next";
import CertificateList from "../superadmincomponents/CertificateList"

export const metadata: Metadata = {
    title: "List Certificate | ChainTrack",
    description: "Certificate that listed for product",
    icons: {
        icon: "/icon.png" 
    },
    openGraph: {
        title: "List Certificate - ChainTrack",
        description: "Certificate that listed for product",
        url: "https://chaintrack.id/dashboard/list-certificate",
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

const ManageCertificatePage = () => {
    return (
        <div>
            <CertificateList />
        </div>
    )
}

export default ManageCertificatePage