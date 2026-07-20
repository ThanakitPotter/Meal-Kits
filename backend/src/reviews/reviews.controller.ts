import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findLatest() {
    return this.reviewsService.findLatest();
  }

  @Get('all')
  findAll() {
    return this.reviewsService.findAll();
  }

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get('seed')
  seed() {
    return this.reviewsService.seed();
  }
}
