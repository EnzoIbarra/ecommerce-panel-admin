import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

type ProductResponse = Omit<ProductWithCategory, 'price'> & {
  price: number;
};

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<ProductResponse> {
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category does not exist');
    }

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        price: new Prisma.Decimal(data.price),
        categoryId: data.categoryId,
      },
      include: { category: true },
    });

    return this.toResponse(product);
  }

  async findAll(): Promise<ProductResponse[]> {
    const products = await this.prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => this.toResponse(product));
  }

  async findOne(id: string): Promise<ProductResponse> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toResponse(product);
  }

  async update(id: string, data: UpdateProductDto): Promise<ProductResponse> {
    await this.findOne(id);

    if (data.categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestException('Category does not exist');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.price !== undefined && {
          price: new Prisma.Decimal(data.price),
        }),
        ...(data.categoryId && { categoryId: data.categoryId }),
      },
      include: { category: true },
    });

    return this.toResponse(updatedProduct);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  private toResponse(product: ProductWithCategory): ProductResponse {
    return {
      ...product,
      price: Number(product.price),
    };
  }
}
