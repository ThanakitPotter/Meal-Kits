export declare class Order {
    id: string;
    orderType: 'subscription' | 'one-time';
    items: {
        menuId: string;
        menuName: string;
        servings: number;
        price: number;
        quantity: number;
    }[];
    userId?: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    status: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว';
    totalPrice: number;
    createdAt: string;
}
