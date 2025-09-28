'use client'

import { useParams } from "next/navigation";
import DetailedInvoices from "../../../admincomponents/DetailedInvoices";

export default function InvoiceDetailPage() {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Loading...</div>
    return (
        <div className="flex gap-3">
            <DetailedInvoices invoiceId={id} />
        </div>
    )
}