import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const { userId, rating, review } = createReviewDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hasOrder = await this.orderRepository.findOne({ where: { userId } });
    if (!hasOrder) {
      throw new BadRequestException('Only customers who have placed an order can leave a review.');
    }

    const newReview = this.reviewRepository.create({
      userId,
      userName: user.name,
      role: user.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ลูกค้า',
      image: `https://i.pravatar.cc/150?u=${userId}`,
      rating,
      review,
    });

    return this.reviewRepository.save(newReview);
  }

  async findLatest() {
    return this.reviewRepository.find({
      order: { createdAt: 'DESC' },
      take: 3,
    });
  }

  async seed() {
    const mockReviews = [
      {
        userName: 'คุณนัท ณัฐพล',
        role: 'พนักงานออฟฟิศ',
        review: 'สะดวกมากครับ เลิกงานดึกแค่ไหนก็ทำอาหารอร่อยๆ กินเองได้ วัตถุดิบสดเหมือนไปตลาดเองเลย แถมรสชาติเป๊ะมาก!',
        rating: 5,
        image: 'https://i.pravatar.cc/150?u=1',
      },
      {
        userName: 'คุณเมย์ เมทินี',
        role: 'แม่บ้าน',
        review: 'ประหยัดเวลาเตรียมของไปได้เยอะมากค่ะ ลูกๆ ชอบเมนูสปาเก็ตตี้มาก ทำง่าย ไม่ต้องกลัวรสชาติเพี้ยนเลย แนะนำค่ะ',
        rating: 5,
        image: 'https://i.pravatar.cc/150?u=2',
      },
      {
        userName: 'คุณบอย ปกรณ์',
        role: 'วิศวกร',
        review: 'ปกติทำอาหารไม่เป็นเลย แต่อันนี้มีวิธีทำบอกละเอียด ตวงมาให้พอดีเป๊ะ ทำออกมาหน้าตาดีเหมือนเชฟทำให้กินเลยครับ 555',
        rating: 5,
        image: 'https://i.pravatar.cc/150?u=3',
      },
    ];

    await this.reviewRepository.clear();

    const firstUser = await this.userRepository.findOne({ where: {} });
    let seedUserId = firstUser?.id;
    if (!seedUserId) {
      const dummyUser = this.userRepository.create({
        name: 'Seed User',
        email: 'seed' + Date.now() + '@example.com',
        passwordHash: 'dummy',
        phone: '0000000000',
        role: 'user',
      });
      const savedUser = await this.userRepository.save(dummyUser);
      seedUserId = savedUser.id;
    }
    
    for (const r of mockReviews) {
      const newReview = this.reviewRepository.create({
        userId: seedUserId,
        userName: r.userName,
        role: r.role,
        image: r.image,
        rating: r.rating,
        review: r.review,
      });
      await this.reviewRepository.save(newReview);
    }
    
    return { message: 'Seeded 3 reviews successfully' };
  }
}
