import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './guard/accessToken.guard';
import { RefreshTokenGuard } from './guard/refreshToken.guard';

interface IUserRequest extends Request {
	user: {
		email: string;
		refreshToken: string;
	};
}

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.authService.register(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	async login(@Body() { login, password }: AuthDto) {
		const { email } = await this.authService.validateUser(login, password);
		return this.authService.login(email);
	}

	@UseGuards(AccessTokenGuard)
	@Get('logout')
	async logout(@Req() req: IUserRequest) {
		this.authService.logout(req.user.email);
	}

	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	async refresh(@Req() req: IUserRequest) {
		return this.authService.refreshTokens(req.user.email, req.user.refreshToken);
	}
}
