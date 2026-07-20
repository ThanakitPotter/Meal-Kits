import { Injectable, UnauthorizedException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

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

  async register(data: any) {
    const existing = await this.usersRepository.findOne({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
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

  async login(data: any) {
    const user = await this.usersRepository.findOne({ where: { email: data.email } });
    if (!user) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    };
  }

  async validateOAuthLogin(profile: any) {
    const { email, name } = profile;
    
    let user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      user = this.usersRepository.create({
        email,
        name,
        role: 'user',
        // passwordHash and phone are nullable
      });
      await this.usersRepository.save(user);
    }

    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    };
  }
}
