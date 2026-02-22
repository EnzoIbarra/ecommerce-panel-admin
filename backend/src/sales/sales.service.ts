import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Prisma, SaleStatus, PaymentStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

type SaleResponse = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  shippingAddress: string;
  total: number;
  status: SaleStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
};

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSaleDto): Promise<SaleResponse> {
    return this.prisma.$transaction(async (tx) => {
      const productIds = data.items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
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

        const unitPrice = product.price;
        const subtotal = unitPrice.mul(item.quantity);
        total = total.add(subtotal);

        return {
          productId: product.id,
          productNameSnapshot: product.name,
          unitPrice,
          quantity: item.quantity,
          subtotal,
        };
      });

      const orderNumber = `ORD-${randomUUID().slice(0, 8)}`;

      const sale = await tx.sale.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          shippingAddress: data.shippingAddress,
          paymentMethod: 'Credit Card',
          total,
          status: SaleStatus.PREPARING,
          paymentStatus: PaymentStatus.PAID,
          items: {
            create: saleItemsData,
          },
          histories: {
            create: {
              status: SaleStatus.PREPARING,
              note: 'Venta creada',
              changedBy: 'System',
            },
          },
        },
        include: {
          items: true,
        },
      });

      return this.mapSaleToResponse(sale);
    });
  }

  async findAll(): Promise<SaleResponse[]> {
    const sales = await this.prisma.sale.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return sales.map((sale) => this.mapSaleToResponse(sale));
  }

  async updateStatus(
    saleId: string,
    newStatus: SaleStatus,
    changedBy: string,
  ): Promise<SaleResponse> {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: { items: true },
      });

      if (!sale) {
        throw new NotFoundException('Sale not found');
      }

      const updatedSale = await tx.sale.update({
        where: { id: saleId },
        data: { status: newStatus },
        include: { items: true },
      });

      await tx.saleHistory.create({
        data: {
          saleId,
          status: newStatus,
          note: `Status changed to ${newStatus}`,
          changedBy,
        },
      });

      return this.mapSaleToResponse(updatedSale);
    });
  }

  private mapSaleToResponse(
    sale: Prisma.SaleGetPayload<{ include: { items: true } }>,
  ): SaleResponse {
    return {
      id: sale.id,
      orderNumber: sale.orderNumber,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail,
      shippingAddress: sale.shippingAddress,
      paymentMethod: sale.paymentMethod,
      total: Number(sale.total),
      status: sale.status,
      paymentStatus: sale.paymentStatus,
      createdAt: sale.createdAt,
      items: sale.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productNameSnapshot,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        subtotal: Number(item.subtotal),
      })),
    };
  }
}
