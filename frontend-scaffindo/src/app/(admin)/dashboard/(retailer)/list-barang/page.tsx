"use client"

import SearchProducts from "../../admincomponents/SearchProducts";
import CategoryProducts from "../../admincomponents/CategoryProducts";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/app/type/types";
import ProductRetailsPage from "../../admincomponents/productRetails";
import { useLabels } from "@/app/hooks/useLabels";
import { useTrackings } from "@/app/hooks/useTrackings";

const ListBarangPage = () => {
    const {fetchLabels, labels} = useLabels();
    const { fetchTrackingById, tracking } = useTrackings();
    const [trackingMap, setTrackingMap] = useState<Record<string, string | null>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [fullLoading, setFullLoading] = useState(true);
    
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        const loadLabels = async () => {
            setFullLoading(true);
            await fetchLabels();
        };
        loadLabels();
    }, []);

    useEffect(() => {
        const loadTrackings = async () => {
            if (labels.length === 0) return;

            const map: Record<string, string | null> = {};

            await Promise.all(
                labels.map(async (label) => {
                    const trackingData = await fetchTrackingById(label.id);
                    if (Array.isArray(trackingData) && trackingData.length > 0) {
                        const lastTracking = trackingData[trackingData.length - 1];
                        map[label.id] = lastTracking?.companyId || null;
                    } else {
                        map[label.id] = null;
                    }
                })
            );

            setTrackingMap(map);
            setFullLoading(false);
        };

        loadTrackings();
    }, [labels]);

    const statusFilters = [
        {
            type: "status",
            label: "Status Pengiriman",
            options: [
                { label: "Arrived At Retail", value: "ARRIVED_AT_RETAIL" },
                { label: "Purchased by Customer", value: "PURCHASED_CUSTOMER" },
                { label: "All", value: "all" },
            ],
        },
    ];

    const handleFilterSelect = (type: string, value: string | null) => {
        if (type === "status") {
            setSelectedCategory(value);
        }
    };    

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const loggedInUser = JSON.parse(userStr);
            if (loggedInUser?.companyId) {
                setCompanyId(loggedInUser.companyId);
            }
        }
    }, []);

    const filteredLabels = useMemo(() => {
        const allowedStatuses = ["ARRIVED_AT_RETAIL", "PURCHASED_CUSTOMER"];

        return labels.filter((label: Label) => {
            const lastTrackingId = label.trackings?.[label.trackings.length - 1];
            const lastTrackingCompanyId = trackingMap[label.id] || null;

            const matchCompany = lastTrackingCompanyId === companyId;
            const matchStatus = allowedStatuses.includes(label.status);
            const matchSearch = label.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory =
                !selectedCategory || selectedCategory === "all" || label.status === selectedCategory;

            return matchCompany && matchStatus && matchSearch && matchCategory;
        });
    }, [labels, trackingMap, companyId, searchQuery, selectedCategory]);

    return (
        <>
            <div className="flex gap-3">
                <CategoryProducts filters={statusFilters} onSelect={handleFilterSelect} />
                <SearchProducts 
                    placeholder="Search your products" 
                    onSearch={handleSearch}
                />
            </div>
            <div className="mt-5">
                <ProductRetailsPage label={filteredLabels} link="list-barang" loading={fullLoading}/>
            </div>
        </>
    )
}

export default ListBarangPage