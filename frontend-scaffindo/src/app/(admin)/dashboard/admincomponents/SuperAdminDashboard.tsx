import { useEffect, useState } from "react";
import axios from "axios";
import { useCompany } from "@/app/hooks/useCompany";
import { useUser } from "@/app/hooks/useUser";
import { useCertificate } from "@/app/hooks/useCertificate";
import { StatCard } from "./StatCard";
import StatCharts from "./StatCharts";
import { useProduct } from "@/app/hooks/useProduct";
import DropdownOneSelect from "../(superadmin)/superadmincomponents/DropdownOneSelect";

function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        companies: 0,
        users: 0,
        products: 0,
        certificates: 0,
    });
    const { fetchCompanies, companies } = useCompany();
    const { fetchProducts, products} = useProduct();
    const { fetchUsersAdmin, users } = useUser();
    const { fetchCertificates, certificates } = useCertificate();
    const [selectedCompany, setSelectedCompany] = useState<string | null>("ALL");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
        fetchUsersAdmin();
        fetchCertificates();
        fetchProducts();
    }, []);

    useEffect(() => {
        setStats({
            companies: companies.length,
            users: users.length,
            products: products.length,
            certificates: certificates.length,
        });
        setLoading(false);
    }, [companies, users, products, certificates]);
    
    const factoryCompanies = companies.filter((c) => c.companyType === "FACTORY");

    const productCountPerCompany = factoryCompanies.map((c) => ({
        name: c.name,
        value: products.filter((p) => p.companyId === c.id).length,
    }));

    const filteredChartData =
        selectedCompany === "ALL"
        ? productCountPerCompany
        : productCountPerCompany.filter((item) => item.name === selectedCompany);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Super Admin Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard title="Total Companies" value={stats.companies} />
                <StatCard title="Total Users" value={stats.users} />
                <StatCard title="Total Products" value={stats.products} />
                <StatCard title="Total Certificates" value={stats.certificates} />
            </div>

            <StatCharts
                data={[
                    { name: "Companies", value: stats.companies },
                    { name: "Users", value: stats.users },
                    { name: "Products", value: stats.products },
                    { name: "Certificates", value: stats.certificates },
                ]}
            />

            <div className="mt-6">
                <DropdownOneSelect
                label="Filter by Company"
                options={[
                    { value: "ALL", label: "All Companies" },
                    ...factoryCompanies.map((c) => ({ value: c.name, label: c.name })),
                ]}
                selected={selectedCompany}
                onChange={(val) => setSelectedCompany(val)}
                />
            </div>
            <StatCharts title="📦 Product Count per Company" data={filteredChartData} />
        </div>
    );
}

export default SuperAdminDashboard;
