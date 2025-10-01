"use client";

import { useEffect, useState } from "react";
import SuperAdminDashboard from "./admincomponents/SuperAdminDashboard";

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
            return <FactoryDashboard subRole={user.subRole} />;
        case "DISTRIBUTOR":
            return <DistributorDashboard subRole={user.subRole} />;
        case "AGENT":
            return <AgentDashboard subRole={user.subRole} />;
        case "RETAIL":
            return <RetailDashboard subRole={user.subRole} />;
        default:
            return <p>Role not recognized</p>;
    }
}

function FactoryDashboard({ subRole }: { subRole: string }) {
    return <div>🏭 Factory Dashboard ({subRole})</div>;
}

function DistributorDashboard({ subRole }: { subRole: string }) {
    return <div>🚚 Distributor Dashboard ({subRole})</div>;
}

function AgentDashboard({ subRole }: { subRole: string }) {
    return <div>🤝 Agent Dashboard ({subRole})</div>;
}

function RetailDashboard({ subRole }: { subRole: string }) {
    return <div>🛒 Retail Dashboard ({subRole})</div>;
}
