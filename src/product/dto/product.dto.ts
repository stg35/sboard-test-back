import { IsNotEmpty, IsNumber, Max, MaxLength, Min } from 'class-validator';

export class ProductDto {
	@IsNotEmpty()
	@MaxLength(255, { message: 'Name must be string and less than 255 symbols' })
	name: string;

	@IsNotEmpty()
	@MaxLength(255, { message: 'Description must be string and less than 255 symbols' })
	description: string;

	@IsNumber({ maxDecimalPlaces: 2 })
	@Min(0)
	@Max(999)
	price: number;
}
