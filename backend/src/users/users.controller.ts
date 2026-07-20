import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const data = await this.usersService.validateOAuthLogin(req.user);
    // Redirect to frontend with token
    // In dev: http://localhost:3000
    // In prod: process.env.FRONTEND_URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${data.access_token}&user=${encodeURIComponent(JSON.stringify(data.user))}`);
  }

  @Post(':id/profile')
  updateProfile(@Req() req: any, @Body() body: any) {
    const id = req.params.id;
    return this.usersService.updateProfile(id, body);
  }
}
