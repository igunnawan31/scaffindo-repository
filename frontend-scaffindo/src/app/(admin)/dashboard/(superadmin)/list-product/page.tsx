import { Metadata } from "next";
import ProductList from "../superadmincomponents/ProductList"

export const metadata: Metadata = {
    title: "List Product | ChainTrack",
    description: "Product from every Company",
    icons: {
        icon: "/icon.png" 
    },
    openGraph: {
        title: "List Product - ChainTrack",
        description: "Product from every Company",
        url: "https://chaintrack.id/dashboard/list-product",
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


const ManageProductPage = () => {
    return (
        <div>
            <ProductList />
        </div>
    )
}

export default ManageProductPage