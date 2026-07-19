import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(body: any): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            phone: string;
        };
    }>;
    login(body: any): Promise<{
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
