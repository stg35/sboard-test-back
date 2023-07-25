import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 255 })
	name: string;

	@Column('varchar', { length: 255 })
	description: string;

	@Column('numeric', { precision: 5, scale: 2 })
	price: number;
}
