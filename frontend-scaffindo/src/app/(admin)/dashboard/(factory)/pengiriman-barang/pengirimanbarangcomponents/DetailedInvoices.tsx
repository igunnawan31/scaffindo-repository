import invoiceProducts from "@/app/data/invoiceProducts";
import Image from "next/image";

type Props = { invoiceId: string }

const DetailedInvoices = ({ invoiceId }: Props) => {
    const product = invoiceProducts.find((p) =>
        p.invoices.some((inv) => inv.id === invoiceId)
    );
    const invoice = product?.invoices.find((inv) => inv.id === invoiceId);
    if (!product || !invoice) {
        return (
            <div className="p-6">
                <h2 className="text-red-500 font-bold">Invoice not found</h2>
            </div>
        );
    }

    const invoiceLabels = product.labels.filter((label) =>
        invoice.labels.includes(label.id)
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full">
            <div className="w-full py-5 block md:flex gap-5 rounded-lg overflow-hidden">
                <div className="md:w-1/2 w-full relative h-[24rem]">
                    <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                    />
                </div>

                <div className="mt-5 md:mt-0">
                    <h1 className="text-2xl font-bold text-blue-900">{invoice.id}</h1>
                    <p className="text-gray-600">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.description}</p>
                </div>
            </div>

            <div className="mt-5">
                <h3 className="font-semibold text-lg mb-3">List Products</h3>
                <div className="space-y-3">
                    {invoiceLabels.map((label) => (
                        <div
                            key={label.id}
                            className="flex justify-between items-center border rounded-lg p-3 shadow-sm"
                        >
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">
                                QR: {label.qrCode}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DetailedInvoices