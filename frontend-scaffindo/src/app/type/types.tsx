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

export type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    subRole: string;
};

export type UserResponse = {
    data: User[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export type Company = {
    id: string;
    name: string;
}

export interface FileMetaDataResponse {
    fileName: string;
    url: string;
    mimeType: string;
    size: number;
}

export interface Certificate {
    id: string;
    name: string;
    expired: string;
    details: string;
    document: FileMetaDataResponse[];
    productId: string;
}