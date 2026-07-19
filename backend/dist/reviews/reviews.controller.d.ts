import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findLatest(): Promise<import("./review.entity").Review[]>;
    create(createReviewDto: CreateReviewDto): Promise<import("./review.entity").Review>;
    seed(): Promise<{
        message: string;
    }>;
}
