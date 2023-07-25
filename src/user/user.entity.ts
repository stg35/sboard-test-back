import { genSalt, hash } from 'bcryptjs';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	constructor(email: string) {
		this.email = email;
	}

	private _passwordHash: string;

	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 255, unique: true })
	email: string;

	@Column('varchar', { length: 255 })
	get passwordHash() {
		return this._passwordHash;
	}
	set passwordHash(password: string) {
		this._passwordHash = password;
	}

	async setPasssword(password: string) {
		const salt = await genSalt(10);
		this._passwordHash = await hash(password, salt);
	}
}
