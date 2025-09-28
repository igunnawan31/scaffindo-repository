'use client'

import { useParams } from "next/navigation";
import DetailedInvoices from "../../../admincomponents/DetailedInvoices"

export default function InvoiceDetailPage() {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Loading...</div>

    return (
        <div className="flex gap-3 w-full">
            <DetailedInvoices 
                invoiceId={id} 
                showButton={true} 
                statusUpdate="WAITING_DISTRIBUTOR" 
            />
        </div>
    );
}