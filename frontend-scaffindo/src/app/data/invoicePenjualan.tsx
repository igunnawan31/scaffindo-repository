const invoicePenjualan = [
    {
        id: "SALE-001",
        customer: {
        name: "Andi Pratama",
        contact: "081234567890",
        },
            labels: [
            {
                labelId: "KaosPrinting-1",
                productId: 1,
                productName: "Kaos Printing",
                harga: 100000,
            },
            {
                labelId: "Sticker-1",
                productId: 2,
                productName: "Sticker",
                harga: 20000,
            },
        ],
        totalHarga: 120000,
        paymentMethod: "QRIS",
        soldAt: "2025-09-15T14:30:00Z",
    },
    {
        id: "SALE-002",
        customer: {
        name: "Budi Santoso",
        contact: "081234567891",
        },
            labels: [
            {
                labelId: "Totebag-1",
                productId: 4,
                productName: "Totebag",
                harga: 800000,
            },
        ],
        totalHarga: 800000,
        paymentMethod: "Transfer Bank",
        soldAt: "2025-09-16T10:00:00Z",
    },
    {
        id: "SALE-003",
        customer: {
            name: "Citra Dewi",
            contact: "081234567892",
        },
        labels: [
            {
                labelId: "Banner-1",
                productId: 3,
                productName: "Banner",
                harga: 50000,
            },
            {
                labelId: "Totebag-2",
                productId: 4,
                productName: "Totebag",
                harga: 800000,
            },
        ],
        totalHarga: 850000,
        paymentMethod: "Cash",
        soldAt: "2025-09-18T16:45:00Z",
    },
];

export default invoicePenjualan