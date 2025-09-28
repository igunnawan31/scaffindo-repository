'use client'

import DetailedInvoices from "../../../admincomponents/DetailedInvoices";
import { useParams } from "next/navigation";

export default function InvoiceDetailPage({params} : {params: Promise<{invoiceId: string}>}) {
    const { id } = useParams<{ id: string }>();

    if (!id) return <div>Loading...</div>

    return (
        <div className="flex gap-3 w-full">
            <DetailedInvoices
                invoiceId={id}
                acceptButton={true}
                statusUpdate="DISTRIBUTOR_ACCEPTED"
                backHomeLink="distributor"
            />
        </div>
    );
}