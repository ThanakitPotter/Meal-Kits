export declare class Order {
    id: string;
    menuId: string;
    userId?: string;
    menuName: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    servings: 1 | 2;
    status: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว';
    totalPrice: number;
    createdAt: string;
}
