import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './user.constants';
import { compare } from 'bcryptjs';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly productRepository: Repository<User>) {}

	async createUser(dto: AuthDto): Promise<User> {
		const newUser = new User(dto.login);
		await newUser.setPasssword(dto.password);
		return this.productRepository.save(newUser);
	}

	async findUser(email: string): Promise<User | null> {
		return this.productRepository.findOneBy({ email });
	}

	async validateUser(email: string, password: string): Promise<Pick<User, 'email'>> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return { email: user.email };
	}
}
