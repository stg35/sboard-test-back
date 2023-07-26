import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import {
	ACCESS_DENIED_ERROR,
	ALREADY_REGISTERED_ERROR,
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { compare } from 'bcryptjs';
import { User } from 'src/user/user.entity';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async validateUser(email: string, password: string): Promise<Pick<User, 'email'>> {
		const user = await this.userService.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return { email: user.email };
	}

	async register(dto: AuthDto): Promise<Pick<User, 'email' | 'id'>> {
		const oldUser = await this.userService.findUser(dto.login);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}
		const newUser = await this.userService.createUser(dto);
		const tokens = await this.getTokens(newUser.email);
		await this.updateRefreshToken(newUser, tokens.refreshToken);
		return { id: newUser.id, email: newUser.email, ...tokens };
	}

	async login(email: string) {
		const tokens = await this.getTokens(email);
		const user = await this.userService.findUser(email);
		await user.setRefreshToken(tokens.refreshToken);
		await this.userService.update(user);
		return {
			...tokens,
		};
	}

	async updateRefreshToken(user: User, refreshToken: string): Promise<void> {
		await user.setRefreshToken(refreshToken);
		await this.userService.update(user);
	}

	async logout(email: string): Promise<User> {
		const user = await this.userService.findUser(email);
		await user.setRefreshToken('');
		return this.userService.update(user);
	}

	async getTokens(email: string) {
		const payload = { email };
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.configService.get('JWT_ACCESS_SECRET'),
				expiresIn: '15m',
			}),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get('JWT_REFRESH_SECRET'),
				expiresIn: '7d',
			}),
		]);
		return { accessToken, refreshToken };
	}

	async refreshTokens(email: string, refreshToken: string) {
		const user = await this.userService.findUser(email);
		if (!user || !user.refreshTokenHash) {
			throw new ForbiddenException(ACCESS_DENIED_ERROR);
		}
		const refreshTokenMatches = await compare(refreshToken, user.refreshTokenHash);
		if (!refreshTokenMatches) {
			console.log('not match');
			throw new ForbiddenException(ACCESS_DENIED_ERROR);
		}
		const tokens = await this.getTokens(email);
		await this.updateRefreshToken(user, tokens.refreshToken);
		return { ...tokens };
	}
}
