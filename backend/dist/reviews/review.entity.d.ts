import { User } from '../users/user.entity';
export declare class Review {
    id: string;
    userId: string;
    userName: string;
    role: string;
    image: string;
    rating: number;
    review: string;
    createdAt: Date;
    user: User;
}
