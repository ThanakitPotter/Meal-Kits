export class CreateOrderDto {
  menuId!: string;
  userId?: string;
  customerName!: string;
  customerPhone!: string;
  shippingAddress!: string;
  servings!: 1 | 2;
}
