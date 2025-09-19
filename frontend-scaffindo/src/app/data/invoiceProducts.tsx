import { IoLeaf, IoCube, IoCar, IoStorefront, IoPerson } from "react-icons/io5";

const invoiceProducts = [
    {
        id: 1,
        name: "Kaos Printing",
        description: "Kaos dengan desain custom printing.",
        category: ["Clothing"],
        image: "/assets/images/sucofindo-1.jpg",
        certification: [
            {
                certificationId: "CERT-KAOS-001",
                certificationName: "SNI Tekstil",
                certificationExpired: "2026-12-31",
            },
            {
                certificationId: "CERT-KAOS-002",
                certificationName: "ISO 9001:2015",
                certificationExpired: "2027-06-30",
            },
            {
                certificationId: "CERT-KAOS-003",
                certificationName: "ISO 9001:2015",
                certificationExpired: "2027-06-25",
            },
        ],
        labels: [
            {
                id: "KaosPrinting-1",
                qrCode: "QR_KaosPrinting-1",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-01T10:00:00Z" },
                    { role: "distributor", status: "Belum diterima", updatedAt: "" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
                journey: [
                    {
                        id: 1,
                        icon: <IoLeaf className="w-6 h-6 text-green-500" />,
                        title: "Pabrik",
                        date: "1 September 2025, 10:00 WIB",
                        details: ["Status: Produksi selesai"],
                    },
                ],
            },
            {
                id: "KaosPrinting-2",
                qrCode: "QR_KaosPrinting-2",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-01T10:00:00Z" },
                    { role: "distributor", status: "Belum diterima", updatedAt: "" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
                journey: [
                    {
                        id: 1,
                        icon: <IoLeaf className="w-6 h-6 text-green-500" />,
                        title: "Pabrik",
                        date: "2 September 2025, 12:00 WIB",
                        details: ["Status: Produksi selesai"],
                    },
                ],
            },
        ],
        invoices: [
            {
                id: "INV-001",
                labels: ["KaosPrinting-1", "KaosPrinting-2"],
                qrCode: "QR_Invoice_KaosPrinting_INV001",
            },
        ],
    },
    {
        id: 2,
        name: "Sticker",
        description: "Sticker vinyl tahan air untuk berbagai kebutuhan.",
        image: "/assets/images/sucofindo-1.jpg",
        certification: [
            {
                certificationId: "CERT-STICKER-001",
                certificationName: "SNI Plastik",
                certificationExpired: "2026-09-01",
            },
        ],
        labels: [
            {
                id: "Sticker-1",
                qrCode: "QR_Sticker-1",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-05T09:30:00Z" },
                    { role: "distributor", status: "Belum diterima", updatedAt: "" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
                journey: [
                    {
                        id: 1,
                        icon: <IoLeaf className="w-6 h-6 text-green-500" />,
                        title: "Pabrik",
                        date: "5 September 2025, 09:30 WIB",
                        details: ["Status: Produksi selesai"],
                    },
                ],
            },
        ],
        invoices: [
            {
                id: "INV-002",
                labels: ["Sticker-1"],
                qrCode: "QR_Invoice_Sticker_INV002",
            },
        ],
    },
    {
        id: 3,
        name: "Banner",
        description: "Banner promosi dengan bahan berkualitas tinggi.",
        image: "/assets/images/sucofindo-1.jpg",
        certification: [
            {
                certificationId: "CERT-BANNER-001",
                certificationName: "ISO 14001:2015",
                certificationExpired: "2028-01-01",
            },
        ],
        labels: [
            {
                id: "Banner-1",
                qrCode: "QR_Banner-1",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-06T14:00:00Z" },
                    { role: "distributor", status: "Dalam perjalanan", updatedAt: "2025-09-07T09:00:00Z" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
                journey: [
                    {
                        id: 1,
                        icon: <IoLeaf className="w-6 h-6 text-green-500" />,
                        title: "Pabrik",
                        date: "6 September 2025, 14:00 WIB",
                        details: ["Status: Produksi selesai"],
                    },
                    {
                        id: 2,
                        icon: <IoCar className="w-6 h-6 text-blue-500" />,
                        title: "Distributor",
                        date: "7 September 2025, 09:00 WIB",
                        details: ["Status: Dalam perjalanan"],
                    },
                ],
            },
        ],
        invoices: [
            {
                id: "INV-003",
                labels: ["Banner-1"],
                qrCode: "QR_Invoice_Banner_INV003",
            },
        ],
    },
    {
        id: 4,
        name: "Totebag",
        description: "Totebag custom printing ramah lingkungan.",
        image: "/assets/images/sucofindo-1.jpg",
        certification: [
            {
                certificationId: "CERT-TOTEBAG-001",
                certificationName: "Ecolabel",
                certificationExpired: "2027-03-15",
            },
        ],
        labels: [
            {
                id: "Totebag-1",
                qrCode: "QR_Totebag-1",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-08T10:00:00Z" },
                    { role: "distributor", status: "Belum diterima", updatedAt: "" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
                journey: [
                    {
                        id: 1,
                        icon: <IoLeaf className="w-6 h-6 text-green-500" />,
                        title: "Pabrik",
                        date: "8 September 2025, 10:00 WIB",
                        details: ["Status: Produksi selesai"],
                    },
                ],
            },
            {
                id: "Totebag-2",
                qrCode: "QR_Totebag-2",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-08T11:00:00Z" },
                    { role: "distributor", status: "Dalam perjalanan", updatedAt: "2025-09-09T15:00:00Z" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
                journey: [
                    {
                        id: 1,
                        icon: <IoLeaf className="w-6 h-6 text-green-500" />,
                        title: "Pabrik",
                        date: "8 September 2025, 11:00 WIB",
                        details: ["Status: Produksi selesai"],
                    },
                    {
                        id: 2,
                        icon: <IoCar className="w-6 h-6 text-blue-500" />,
                        title: "Distributor",
                        date: "9 September 2025, 15:00 WIB",
                        details: ["Status: Dalam perjalanan"],
                    },
                ],
            },
        ],
        invoices: [
            {
                id: "INV-004",
                labels: ["Totebag-1"],
                qrCode: "QR_Invoice_Totebag_INV004",
            },
            {
                id: "INV-005",
                labels: ["Totebag-2"],
                qrCode: "QR_Invoice_Totebag_INV005",
            },
        ],
    },
];

export default invoiceProducts;
