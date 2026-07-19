export interface Order {
  id: string;
  packageId: string;
  packageName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryMonth: string;
  status: 'Preparing' | 'Shipped' | 'Delivered';
  totalPrice: number;
  createdAt: string;
}
