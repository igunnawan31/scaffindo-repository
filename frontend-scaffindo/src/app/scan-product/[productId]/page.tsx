import CertificationDetails from "../scanproductcomponents/CertificationDetails";
import NavbarComponentsHome from "@/app/components/NavbarComponentsHome";
import Header from "../scanproductcomponents/Header";

type Props = {
  params: { productId: string };
};

const CertificationProduct:React.FC<Props> = ({ params }: Props) => {
    const productId = params.productId;
    return (
        <>
            <NavbarComponentsHome />
            <section
                id="ScanProduct"
                className="relative pt-32 bg-cover bg-center bg-white h-screen"
            >
                <div className="relative z-10 h-full px-4 lg:px-8">
                    <div className="container mx-auto max-w-11/12">
                        <Header />
                        <CertificationDetails productId={productId} />
                    </div>
                </div>
            </section>
        </>
    );
}

export default CertificationProduct