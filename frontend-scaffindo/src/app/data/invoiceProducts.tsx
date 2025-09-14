const invoiceProducts = [
    {
        id: 1,
        name: "Kaos Printing",
        description: "Kaos dengan desain custom printing.",
        image: "/assets/images/sucofindo-1.jpg",
        labels: [
            {
                id: "KaosPrinting-1",
                productId: 1,
                qrCode: "QR_KaosPrinting-1",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-01T10:00:00Z" },
                    { role: "distributor", status: "Belum diterima", updatedAt: "" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
            },
            {
                id: "KaosPrinting-2",
                productId: 1,
                qrCode: "QR_KaosPrinting-2",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-02T12:00:00Z" },
                    { role: "distributor", status: "Dalam perjalanan", updatedAt: "2025-09-03T08:30:00Z" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
            },
        ],
        invoices: [
            {
                id: "INV-001",
                productId: 1,
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
        labels: [
            {
                id: "Sticker-1",
                productId: 2,
                qrCode: "QR_Sticker-1",
                    tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-05T09:30:00Z" },
                    { role: "distributor", status: "Belum diterima", updatedAt: "" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
            },
        ],
        invoices: [
            {
                id: "INV-002",
                productId: 2,
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
        labels: [
            {
                id: "Banner-1",
                productId: 3,
                qrCode: "QR_Banner-1",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-06T14:00:00Z" },
                    { role: "distributor", status: "Dalam perjalanan", updatedAt: "2025-09-07T09:00:00Z" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
            },
        ],
        invoices: [
            {
                id: "INV-003",
                productId: 3,
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
        labels: [
            {
                id: "Totebag-1",
                productId: 4,
                qrCode: "QR_Totebag-1",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-08T10:00:00Z" },
                    { role: "distributor", status: "Belum diterima", updatedAt: "" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
            },
            {
                id: "Totebag-2",
                productId: 4,
                qrCode: "QR_Totebag-2",
                tracking: [
                    { role: "pabrik", status: "Produksi selesai", updatedAt: "2025-09-08T11:00:00Z" },
                    { role: "distributor", status: "Dalam perjalanan", updatedAt: "2025-09-09T15:00:00Z" },
                    { role: "agent", status: "Belum diterima", updatedAt: "" },
                    { role: "retailer", status: "Belum diterima", updatedAt: "" },
                    { role: "consument", status: "Belum diterima", updatedAt: "" },
                ],
            },
        ],
        invoices: [
            {
                id: "INV-004",
                productId: 4,
                labels: ["Totebag-1"],
                qrCode: "QR_Invoice_Totebag_INV004",
            },
            {
                id: "INV-005",
                productId: 4,
                labels: ["Totebag-2"],
                qrCode: "QR_Invoice_Totebag_INV005",
            },
        ],
    },
];

export default invoiceProducts;
