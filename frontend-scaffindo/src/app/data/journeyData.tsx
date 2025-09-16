import { IoCheckmarkCircle, IoLeaf, IoCube, IoCar } from "react-icons/io5";

const journeyData = [
    {
        id: 1,
        icon: <IoLeaf className="w-6 h-6 text-green-500" />,
        title: "Farm Production",
        date: "15 Oktober 2024, 08:00 WIB",
        details: [
            "Lokasi: Kebun Apel Sumber Makmur, Malang",
            "Petani: Pak Slamet (ID: FARMER-001)",
            "Batch: APPLE-BATCH-2024-001",
            "Jumlah: 500 kg apel merah premium",
        ],
        verified: {
            block: "#18,234,567",
            hash: "0x1a2b3c...",
        },
    },
    {
        id: 2,
        icon: <IoCube className="w-6 h-6 text-yellow-500" />,
        title: "Packaging & Quality Check",
        date: "16 Oktober 2024, 14:30 WIB",
        details: [
            "Facility: PT. Agro Fresh Indonesia",
            "Quality Grade: Premium A+",
            "Pesticide Test: Passed ✓",
            "Inspector: Dr. Andi Wijaya",
        ],
        verified: {
            block: "#18,234,789",
            hash: "0x4d5e6f...",
        },
    },
    {
        id: 3,
        icon: <IoCar className="w-6 h-6 text-blue-500" />,
        title: "Distribution Center",
        date: "17 Oktober 2024, 09:15 WIB",
        details: [
            "Distributor: Fresh Mart Distribution",
            "Lokasi: Jakarta, Indonesia",
            "Status: Siap dikirim ke retail",
        ],
        verified: {
            block: "#18,234,900",
            hash: "0x7g8h9i...",
        },
    },
];

export default journeyData