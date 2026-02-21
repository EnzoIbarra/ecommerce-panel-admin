import { PrismaClient, SaleStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });

  const zapatillas = await prisma.category.upsert({
    where: { name: 'Zapatillas' },
    update: {},
    create: {
      name: 'Zapatillas',
    },
  });

  const existingProduct = await prisma.product.findFirst({
    where: { name: 'Modelo Base', categoryId: zapatillas.id },
  });

  const product =
    existingProduct ??
    (await prisma.product.create({
      data: {
        name: 'Modelo Base',
        price: 150,
        categoryId: zapatillas.id,
      },
    }));

  const existingSale = await prisma.sale.findUnique({
    where: { orderNumber: 'ORD-1' },
  });

  if (!existingSale) {
    const sale = await prisma.sale.create({
      data: {
        orderNumber: 'ORD-1',
        customerName: 'Cliente Demo',
        customerEmail: 'cliente@demo.com',
        total: product.price,
        status: SaleStatus.PREPARING,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: 'Card',
        shippingAddress: 'Direccion Demo',
        items: {
          create: [
            {
              productId: product.id,
              productNameSnapshot: product.name,
              unitPrice: product.price,
              quantity: 1,
              subtotal: product.price,
            },
          ],
        },
      },
    });

    await prisma.saleHistory.create({
      data: {
        saleId: sale.id,
        status: SaleStatus.PREPARING,
        note: 'Creado por seed',
        changedBy: 'System',
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
