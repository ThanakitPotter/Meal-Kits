import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.usersService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.usersService.login(body);
  }
}
