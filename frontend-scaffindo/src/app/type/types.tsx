type TrackingStatus = {
    role: "pabrik" | "distributor" | "agent" | "retailer" | "consument";
    status: string;
    updatedAt: string;
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

export enum CompanyType {
    FACTORY = "FACTORY",
    DISTRIBUTOR = "DISTRIBUTOR",
    AGENT = "AGENT",
    RETAIL = "RETAIL"
}

export type Company = {
    id: string;
    name: string;
    companyType: CompanyType;
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

export enum LabelStatus {
    FACTORY_DONE = 'FACTORY_DONE',
    WAITING_DISTRIBUTOR = 'WAITING_DISTRIBUTOR',
    DISTRIBUTOR_ACCEPTED = 'DISTRIBUTOR_ACCEPTED',
    DISTRIBUTOR_PICKED_UP = 'DISTRIBUTOR_PICKED_UP',
    ARRIVED_AT_DISTRIBUTOR = 'ARRIVED_AT_DISTRIBUTOR',
    AGENT_ACCEPTED = 'AGENT_ACCEPTED',
    DISTRIBUTOR_TO_AGENT = 'DISTRIBUTOR_TO_AGENT',
    ARRIVED_AT_AGENT = 'ARRIVED_AT_AGENT',
    RETAIL_ACCEPTED = 'RETAIL_ACCEPTED',
    AGENT_TO_RETAIL = 'AGENT_TO_RETAIL',
    ARRIVED_AT_RETAIL = 'ARRIVED_AT_RETAIL',
    PURCHASED_BY_CUSTOMER = 'PURCHASED_BY_CUSTOMER'
}

export type Label = {
    id: string;
    status: LabelStatus;
    productId: string;
    invoiceId: string;
    penjualanId: string;
    trackingIds: string[];
    createdAt: string;
    updatedAt: string;
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

export interface CreateInvoiceDto {
    productId: number;
    nextCompanyId: string;
    totalLabel: number;
    title: string;
    description: string;
}

export interface Invoice extends CreateInvoiceDto {
    id: string;
    status: string;
    labelIds: Label[];
    companyId: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
}