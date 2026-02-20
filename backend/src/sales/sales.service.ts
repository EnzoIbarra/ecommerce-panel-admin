import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Prisma } from '@prisma/client';

type SaleResponse = {
  id: string;
  total: number;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
  }[];
};

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSaleDto): Promise<SaleResponse> {
    return this.prisma.$transaction(async (tx) => {
      const productIds = data.items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products do not exist');
      }

      let total = new Prisma.Decimal(0);

      const saleItemsData = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);

        if (!product) {
          throw new BadRequestException('Invalid product in sale');
        }

        const itemTotal = product.price.mul(item.quantity);
        total = total.add(itemTotal);

        return {
          productId: product.id,
          quantity: item.quantity,
          price: product.price, // precio histórico
        };
      });

      const sale = await tx.sale.create({
        data: {
          total,
          items: {
            create: saleItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      return {
        id: sale.id,
        total: Number(sale.total),
        createdAt: sale.createdAt,
        items: sale.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.price),
        })),
      };
    });
  }

  async findAll(): Promise<SaleResponse[]> {
    const sales = await this.prisma.sale.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sales.map((sale) => ({
      id: sale.id,
      total: Number(sale.total),
      createdAt: sale.createdAt,
      items: sale.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    }));
  }
}
