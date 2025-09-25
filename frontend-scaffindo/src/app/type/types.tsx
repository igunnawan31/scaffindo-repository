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

export type User = {
    id: string;
    name: string;
    email: string;
    companyId: string;
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
    path: string;
    size: number;
    filename: string;
    mimetype: string;
}

export interface Certificate {
    id: string;
    name: string;
    expired: string;
    details: string;
    document: FileMetaDataResponse[];
    productId: string;
}

export enum Category {
    CLOTHING,
    FOOD_BEVERAGE,
    ELECTRONIC
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    companyId: string;
    certifications: Certificate[];
    image: FileMetaDataResponse[];
    category: string[];
    labels: Label[];
    invoice: Invoice[];
}