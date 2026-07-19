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
export declare const MOCK_MENUS: Menu[];
