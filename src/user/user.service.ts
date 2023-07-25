import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from 'src/auth/dto/auth.dto';

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
}
