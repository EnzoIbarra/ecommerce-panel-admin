'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSales } from '@/lib/queries';

export default function TopProductsCard() {
	const { data: sales = [], isLoading } = useSales();

	if (isLoading) {
		return (
			<Card>
				<CardContent className='p-6'>Calculando productos...</CardContent>
			</Card>
		);
	}

	const productMap: Record<string, { name: string; quantity: number }> = {};

	sales.forEach((sale) => {
		sale.items.forEach((item) => {
			if (!productMap[item.productId]) {
				productMap[item.productId] = {
					name: item.productName,
					quantity: 0,
				};
			}

			productMap[item.productId].quantity += item.quantity;
		});
	});

	const topProducts = Object.values(productMap)
		.sort((a, b) => b.quantity - a.quantity)
		.slice(0, 5);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Productos Más Vendidos</CardTitle>
			</CardHeader>

			<CardContent className='space-y-2'>
				{topProducts.length === 0 ? (
					<p className='text-sm text-muted-foreground'>
						No hay productos top para mostrar.
					</p>
				) : (
					topProducts.map((product, index) => (
						<div key={index} className='flex justify-between text-sm'>
							<span>{product.name}</span>
							<span>{product.quantity} uds.</span>
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}
