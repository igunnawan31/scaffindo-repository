type TrackingStatus = {
    role: "pabrik" | "distributor" | "agent" | "retailer" | "consument";
    status: string;
    updatedAt: string;
};

type Label = {
    id: string;
    productId: number;
    qrCode: string;
    tracking: TrackingStatus[];
};

type Invoice = {
    id: string;
    productId: number;
    labels: string[];
    qrCode: string;
};

type Product = {
    id: number;
    name: string;
    description: string;
    image: string;
    labels: Label[];
    invoices: Invoice[];
};

type User = {
    id: number;
    name: string;
    email: string;
    role: "Factory" | "Distributor";
    subRole: "Admin" | "User";
};