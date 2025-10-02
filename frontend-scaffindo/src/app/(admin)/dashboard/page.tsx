"use client";

import { useEffect, useState } from "react";
import SuperAdminDashboard from "./admincomponents/SuperAdminDashboard";
import FactoryDashboard from "./admincomponents/FactoryDashboard";
import DistributorDashboard from "./admincomponents/DistributorDashboard";
import AgentDashboard from "./admincomponents/AgentDashboard";
import RetailDashboard from "./admincomponents/RetailDashboard";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (userJson) setUser(JSON.parse(userJson));
    }, []);

    if (!user) return <p>Loading...</p>;

    switch (user.role) {
        case "SUPERADMIN":
            return <SuperAdminDashboard />;
        case "FACTORY":
            return <FactoryDashboard subRole={user.subRole} companyId={user.companyId} />;
        case "DISTRIBUTOR":
            return <DistributorDashboard subRole={user.subRole} companyId={user.companyId} />;
        case "AGENT":
            return <AgentDashboard subRole={user.subRole} companyId={user.companyId} />;
        case "RETAIL":
            return <RetailDashboard subRole={user.subRole} companyId={user.companyId} />;
        default:
            return <p>Role not recognized</p>;
    }
}
