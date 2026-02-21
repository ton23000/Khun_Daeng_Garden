// Global Application Types

export interface Tree {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    status: 'AVAILABLE' | 'BOOKED' | 'SOLD';
    images: string[];
    tags: string[];
    growthTime?: string;
    stock: number;
    reserved: number;
    sold: number;
    rating: number;
    reviewCount: number;
    isPromotion: boolean;
    originalPrice?: number | null;
    promotionName?: string | null;
    promotionEndDate?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string | null;
    role: string;
    verified: boolean;
    verificationToken?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Booking {
    id: string;
    userId: string;
    user?: User;
    items: BookingItem[];
    pickupDate: Date | string;
    totalPrice: number;
    deposit: number;
    paymentType: string;
    status: 'PENDING' | 'PENDING_APPROVAL' | 'VERIFYING_PAYMENT' | 'PAYMENT_ISSUE' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
    refCode: string;
    slipUrl?: string | null;
    note?: string | null;
    reviewable: boolean;
    isPreorder: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface BookingItem {
    id: string;
    bookingId: string;
    booking?: Booking;
    treeId: string;
    tree?: Tree;
    quantity: number;
    price: number;
}

export interface Review {
    id: string;
    userId: string;
    user?: User;
    treeId: string;
    tree?: Tree;
    bookingId: string;
    booking?: Booking;
    rating: number;
    comment?: string | null;
    images?: string | null;
    helpful: number;
    hidden: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
