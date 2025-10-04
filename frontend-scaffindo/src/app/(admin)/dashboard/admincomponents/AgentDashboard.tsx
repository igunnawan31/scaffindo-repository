import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import StatCharts from "./StatCharts";
import { useInvoice } from "@/app/hooks/useInvoices";
import { Invoice } from "@/app/type/types";

interface DistributorDashboardProps {
    subRole: string;
    companyId: string;
}

function AgentDashboard({ subRole, companyId }: DistributorDashboardProps) {
    const [stats, setStats] = useState({
        invoicesIn: 0,
        invoiceNotChecked: 0,
    });
    const { fetchInvoices, invoices } = useInvoice();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        const filteredInvoicesByCompany = invoices.filter(
            (p: Invoice) => p.companyId === companyId
        );
        const filteredInvoicesByNextCompany = invoices.filter(
            (p: Invoice) => p.nextCompanyId === companyId
        );
        const invoiceIn = filteredInvoicesByCompany.filter((p: Invoice) => p.status === "WAITING_AGENT")
        const invoiceNotChecked = filteredInvoicesByCompany.filter((p: Invoice) => p.status === "AGENT_ACCEPTED");

        setStats({
            invoicesIn: invoiceIn.length,
            invoiceNotChecked: invoiceNotChecked.length,
        });
        setLoading(false);
    }, [invoices]);
    
    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Agent Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard title="Total Request Invoice" value={stats.invoicesIn} />
                <StatCard title="Invoice Not Checked" value={stats.invoiceNotChecked} />
            </div>

            <StatCharts
                data={[
                    { name: "Total Request Invoices", value: stats.invoicesIn },
                    { name: "Invoice Not Checked", value: stats.invoiceNotChecked },
                ]}
            />
        </div>
    );
}

export default AgentDashboard;
