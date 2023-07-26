import { genSalt, hash } from 'bcryptjs';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	constructor(email: string) {
		this.email = email;
	}

	private _passwordHash: string;
	private _refreshTokenHash: string;

	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 255, unique: true })
	email: string;

	@Column({ unique: true, nullable: true })
	get refreshTokenHash() {
		return this._refreshTokenHash;
	}
	set refreshTokenHash(token: string) {
		this._refreshTokenHash = token;
	}

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

	async setRefreshToken(token: string) {
		if (token == '') {
			this._refreshTokenHash = '';
			return;
		}
		const salt = await genSalt(10);
		this._refreshTokenHash = await hash(token, salt);
	}
}
