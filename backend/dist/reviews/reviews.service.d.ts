import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private reviewRepository;
    private orderRepository;
    private userRepository;
    constructor(reviewRepository: Repository<Review>, orderRepository: Repository<Order>, userRepository: Repository<User>);
    create(createReviewDto: CreateReviewDto): Promise<Review>;
    findLatest(): Promise<Review[]>;
    seed(): Promise<{
        message: string;
    }>;
}
