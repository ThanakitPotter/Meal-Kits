export class CreateOrderDto {
  userId?: string;
  orderType!: 'subscription' | 'one-time';
  customerName!: string;
  customerPhone!: string;
  shippingAddress!: string;
  items!: { menuId: string, menuName: string, servings: number, price: number, quantity: number }[];
  totalPrice!: number;
}
