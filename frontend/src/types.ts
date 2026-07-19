export interface Menu {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  prepTime: string;
  ingredients: string[];
  category: 'ผัด' | 'ต้ม-แกง' | 'ทอด-ย่าง';
  isActive: boolean;
}

export interface Order {
  id: string;
  orderType: 'subscription' | 'one-time';
  items: {
    menuId: string;
    menuName: string;
    servings: number;
    price: number;
    quantity: number;
  }[];
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  status: 'รอดำเนินการ' | 'กำลังจัดเตรียม' | 'จัดส่งแล้ว';
  totalPrice: number;
  createdAt: string;
}
