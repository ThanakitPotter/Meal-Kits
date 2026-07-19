"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./review.entity");
const order_entity_1 = require("../orders/order.entity");
const user_entity_1 = require("../users/user.entity");
let ReviewsService = class ReviewsService {
    reviewRepository;
    orderRepository;
    userRepository;
    constructor(reviewRepository, orderRepository, userRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }
    async create(createReviewDto) {
        const { userId, rating, review } = createReviewDto;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const hasOrder = await this.orderRepository.findOne({ where: { userId } });
        if (!hasOrder) {
            throw new common_1.BadRequestException('Only customers who have placed an order can leave a review.');
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map