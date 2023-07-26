import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenJwtStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenJwtStrategy } from './strategies/refreshToken.strategy';

@Module({
	imports: [JwtModule.register({}), PassportModule, ConfigModule, UserModule],
	providers: [AuthService, AccessTokenJwtStrategy, RefreshTokenJwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
