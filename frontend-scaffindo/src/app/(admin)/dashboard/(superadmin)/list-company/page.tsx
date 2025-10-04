import { Metadata } from "next";
import CompanyList from "../superadmincomponents/CompanyList"

export const metadata: Metadata = {
    title: "List Company | ChainTrack",
    description: "Company that listed",
    icons: {
        icon: "/icon.png" 
    },
    openGraph: {
        title: "List Company - ChainTrack",
        description: "Company that listed",
        url: "https://chaintrack.id/dashboard/list-company",
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


const ManageCompanyPage = () => {
    return (
        <div>
            <CompanyList />
        </div>
    )
}

export default ManageCompanyPage