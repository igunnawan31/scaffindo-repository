"use client";

import DetailedProduct from "../../../admincomponents/DetailedProduct";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="flex gap-3">
            <DetailedProduct productId={id} />
        </div>
  );
}
