'use client'

import { use } from "react";
import DetailedInvoices from "../../../admincomponents/DetailedInvoices";

export default function InvoiceDetailPage({
    params,
}: {
    params: Promise<{ invoiceId: string }>;
}) {
    const { invoiceId } = use(params);

    const handleAcceptInvoice = (invoiceId: string) => {
        console.log("Invoice diterima:", invoiceId);
    };

    return (
        <div className="flex gap-3 w-full">
            <DetailedInvoices
                invoiceId={invoiceId}
                acceptButton={true}
                onButtonClick={handleAcceptInvoice}
            />
        </div>
    );
}