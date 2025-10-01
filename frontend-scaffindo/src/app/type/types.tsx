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
    WAITING_AGENT = 'WAITING_AGENT',
    AGENT_ACCEPTED = 'AGENT_ACCEPTED',
    WAITING_RETAIL = 'WAITING_RETAIL',
    RETAIL_ACCEPTED = 'RETAIL_ACCEPTED',
    ARRIVED_AT_RETAIL = 'ARRIVED_AT_RETAIL',
    PURCHASED_BY_CUSTOMER = 'PURCHASED_BY_CUSTOMER'
}

export type Label = {
    id: string;
    status: LabelStatus;
    productId: string;
    invoiceId: string;
    penjualanId: string;
    trackings: string[];
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
    nextCompanyId?: string | null
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

export enum TrackStatus {
    FACTORY_DONE = 'FACTORY_DONE',
    DISTRIBUTOR_ACCEPTED = 'DISTRIBUTOR_ACCEPTED',
    AGENT_ACCEPTED = 'AGENT_ACCEPTED',
    RETAIL_ACCEPTED = 'RETAIL_ACCEPTED',
    PURCHASED_BY_CUSTOMER = 'PURCHASED_BY_CUSTOMER'
}

export interface Tracking {
    id: string;
    userId: string;
    companyType: CompanyType;
    title: string;
    description: string;
    status: TrackStatus;
    createdAt: string;
    labelId: string;
    companyId: string;
} 


export type PaymentMethod = {
    QRIS: 'QRIS',
    TRANSFER: 'TRANSFER',
    CASH: 'CASH'
}
export interface Penjualan {
    id: string;
    labelIds: string[];
    totalHarga: number;
    paymentMethod: string;
    createdAt: string;
}