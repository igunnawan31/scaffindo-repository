import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useCompany } from "@/app/hooks/useCompany";
import { useUser } from "@/app/hooks/useUser";
import { useCertificate } from "@/app/hooks/useCertificate";
import { StatCard } from "./StatCard";
import StatCharts from "./StatCharts";
import { useProduct } from "@/app/hooks/useProduct";
import DropdownOneSelect from "../(superadmin)/superadmincomponents/DropdownOneSelect";
import { useInvoice } from "@/app/hooks/useInvoices";
import { Invoice } from "@/app/type/types";

interface FactoryProps {
    subRole: string;
    companyId: string;
}

function FactoryDashboard({ subRole, companyId }: FactoryProps) {
    const [stats, setStats] = useState({
        invoices: 0,
        invoiceNotChecked: 0,
    });
    const { fetchInvoices, invoices } = useInvoice();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        if (invoices.length) {
            const filteredInvoicesByCompany = invoices.filter(
                (p: Invoice) => p.companyId === companyId
            );
            const invoiceNotChecked = filteredInvoicesByCompany.filter((p: Invoice) => p.status === "FACTORY_DONE");

            setStats({
                invoices: filteredInvoicesByCompany.length,
                invoiceNotChecked: invoiceNotChecked.length,
            });
            setLoading(false);
        }
    }, [invoices]);
    
    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Factory Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Invoices Created" value={stats.invoices} />
                <StatCard title="Invoice Not Checked" value={stats.invoiceNotChecked} />=
            </div>

            <StatCharts
                data={[
                    { name: "Total Invoices Created", value: stats.invoices },
                    { name: "Invoice Not Checked", value: stats.invoiceNotChecked },
                ]}
            />
        </div>
    );
}

export default FactoryDashboard;
