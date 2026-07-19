"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = __importStar(require("bcryptjs"));
const jwt_1 = require("@nestjs/jwt");
let UsersService = class UsersService {
    usersRepository;
    jwtService;
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async onModuleInit() {
        const adminEmail = 'admin@admin.com';
        const existingAdmin = await this.usersRepository.findOne({ where: { email: adminEmail } });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash('Admin1234', salt);
            const admin = this.usersRepository.create({
                name: 'Super Admin',
                email: adminEmail,
                phone: '0999999999',
                passwordHash,
                role: 'admin',
            });
            await this.usersRepository.save(admin);
            console.log('✅ Default Admin account created: admin@admin.com / Admin1234');
        }
    }
    async register(data) {
        const existing = await this.usersRepository.findOne({ where: { email: data.email } });
        if (existing) {
            throw new common_1.ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.password, salt);
        const role = data.email === 'admin@admin.com' ? 'admin' : 'user';
        const user = this.usersRepository.create({
            name: data.name,
            email: data.email,
            phone: data.phone,
            passwordHash,
            role,
        });
        await this.usersRepository.save(user);
        const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
        };
    }
    async login(data) {
        const user = await this.usersRepository.findOne({ where: { email: data.email } });
        if (!user) {
            throw new common_1.UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        const isMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map