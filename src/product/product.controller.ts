import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(AccessTokenGuard)
	@Post('create')
	async create(@Body() dto: ProductDto) {
		return this.productService.create(dto);
	}

	@UseGuards(AccessTokenGuard)
	@Get()
	async getAll() {
		return this.productService.getAll();
	}

	@UseGuards(AccessTokenGuard)
	@Get(':id')
	async getById(@Param('id') id: string) {
		const product = await this.productService.getById(Number(id));
		if (!product) {
			throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		}
		return product;
	}

	@UseGuards(AccessTokenGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		const isDeleted = await this.productService.delete(Number(id));
		if (!isDeleted) {
			throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
		}
	}

	@UseGuards(AccessTokenGuard)
	@Patch('update/:id')
	async update(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(Number(id), dto);
	}
}
