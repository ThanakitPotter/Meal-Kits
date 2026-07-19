export interface Package {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    items: string[];
    category: '5K' | 'HalfMarathon' | 'Recovery';
    isActive: boolean;
}
export declare const MOCK_PACKAGES: Package[];
