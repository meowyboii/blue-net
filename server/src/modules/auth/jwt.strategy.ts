import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
  const token = (req.cookies as { token?: string })?.token;
  return token || null;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const options: StrategyOptions = {
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    };
    super(options);
  }

  validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
