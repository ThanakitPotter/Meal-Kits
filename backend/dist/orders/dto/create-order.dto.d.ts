export declare class CreateOrderDto {
    userId?: string;
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    items: {
        menuId: string;
        menuName: string;
        servings: number;
        price: number;
        quantity: number;
    }[];
    totalPrice: number;
}
