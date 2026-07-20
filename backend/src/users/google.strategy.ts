import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = process.env.GOOGLE_CLIENT_ID || 'dummy';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || 'dummy';
    console.log('GoogleStrategy initialized with ClientID:', clientID);
    
    super({
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:3001/api/users/google/callback', // We will proxy this in production if needed, or set exactly.
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName + ' ' + (name.familyName || ''),
      accessToken,
    };
    done(null, user);
  }
}
