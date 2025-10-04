import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import StatCharts from "./StatCharts";
import { useInvoice } from "@/app/hooks/useInvoices";
import { Invoice } from "@/app/type/types";

interface DistributorDashboardProps {
    subRole: string;
    companyId: string;
}

function RetailDashboard({ subRole, companyId }: DistributorDashboardProps) {
    const [stats, setStats] = useState({
        invoicesIn: 0,
        invoiceNotChecked: 0,
        invoiceChecked: 0,
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
        const invoiceIn = filteredInvoicesByNextCompany.filter((p: Invoice) => p.status === "WAITING_RETAIL")
        const invoiceNotChecked = filteredInvoicesByCompany.filter((p: Invoice) => p.status === "RETAIL_ACCEPTED");
        const invoiceChecked = filteredInvoicesByCompany.filter((p: Invoice) => p.status === "ARRIVED_AT_RETAIL");

        setStats({
            invoicesIn: invoiceIn.length,
            invoiceNotChecked: invoiceNotChecked.length,
            invoiceChecked: invoiceChecked.length,
        });
        setLoading(false);
    }, [invoices]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Agent Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Request Invoice" value={stats.invoicesIn} />
                <StatCard title="Invoice Not Checked" value={stats.invoiceNotChecked} />
                <StatCard title="Invoice Checked" value={stats.invoiceChecked} />
            </div>

            <StatCharts
                data={[
                    { name: "Total Request Invoices", value: stats.invoicesIn },
                    { name: "Invoice Not Checked", value: stats.invoiceNotChecked },
                    { name: "Invoice Checked", value: stats.invoiceChecked },
                ]}
            />
        </div>
    );
}

export default RetailDashboard;
