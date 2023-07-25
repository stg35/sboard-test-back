import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product) private readonly productRepository: Repository<Product>,
	) {}

	async create(dto: ProductDto): Promise<Product> {
		const newProduct = await this.productRepository.create(dto);
		return this.productRepository.save(newProduct);
	}

	async getAll(): Promise<Product[]> {
		return this.productRepository.find();
	}

	async getById(id: number): Promise<Product | null> {
		return this.productRepository.findOneBy({ id });
	}

	async delete(id: number): Promise<boolean> {
		const deleteResult = await this.productRepository.delete({ id });
		return deleteResult.affected != 0 ? true : false;
	}

	async update(id: number, dto: ProductDto): Promise<Product> {
		const product = await this.getById(id);
		if (!product) {
			throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		}
		return this.productRepository.save({ id, ...dto });
	}
}
