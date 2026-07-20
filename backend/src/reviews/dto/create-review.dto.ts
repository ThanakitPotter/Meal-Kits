export class CreateReviewDto {
  userId: string;
  rating: number;
  review: string;
  orderId?: string;
}
