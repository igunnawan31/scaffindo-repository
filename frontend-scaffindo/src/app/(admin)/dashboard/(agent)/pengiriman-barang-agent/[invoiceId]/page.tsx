import DetailedInvoices from "../../../admincomponents/DetailedInvoices";

export default async function InvoiceDetailPage({params} : {params: Promise<{invoiceId: string}>}) {
    const { invoiceId } = await params;
    return (
        <div className="flex gap-3">
            <DetailedInvoices invoiceId={invoiceId} />
        </div>
    )
}