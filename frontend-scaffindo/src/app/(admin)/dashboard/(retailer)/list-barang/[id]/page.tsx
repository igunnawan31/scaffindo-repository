'use client'

import { useParams } from "next/navigation";
import DetailedInvoices from "../../../admincomponents/DetailedInvoices";
import DetailedLabels from "../../../admincomponents/DetailedLabels";

export default function LabelDetailPage() {
    const { id } = useParams<{ id: string }>();
        
    if (!id) return <div>Loading...</div>
    
    return (
        <div className="flex gap-3">
            <DetailedLabels labelId={id} />
        </div>
    )
}