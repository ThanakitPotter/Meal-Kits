import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
export declare class UsersService implements OnModuleInit {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    onModuleInit(): Promise<void>;
    register(data: any): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            phone: string;
        };
    }>;
    login(data: any): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            role: string;
        };
    }>;
}
