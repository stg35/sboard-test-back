import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/user.entity';
import { Request } from 'express';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_REFRESH_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, { email }: Pick<User, 'email'>) {
		const refreshToken = req.get('authorization').replace('Bearer', '').trim();
		return { email, refreshToken };
	}
}
