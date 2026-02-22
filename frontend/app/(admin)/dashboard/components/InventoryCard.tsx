'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { formatCurrency } from '@/lib/format';
import { useProducts } from '@/lib/queries';
import { useRouter } from 'next/navigation';

export default function InventoryCard() {
	const { data: products = [], isLoading } = useProducts();
	const router = useRouter();

	if (isLoading) {
		return (
			<Card>
				<Loader text='Cargando inventario...' />
			</Card>
		);
	}

	const totalProducts = products.length;
	const totalValue = products.reduce((acc, product) => acc + product.price, 0);

	const recentProducts = products.slice(0, 6);

	return (
		<Card className='h-full flex flex-col'>
			<CardHeader>
				<CardTitle>Inventario de Productos</CardTitle>
			</CardHeader>

			<CardContent className='flex flex-col gap-4 flex-1'>
				<div>
					<p className='text-4xl font-bold'>{totalProducts}</p>
					<p className='text-sm text-muted-foreground'>
						Productos en inventario
					</p>

					<p className='mt-2 text-lg font-semibold'>
						Valor: {formatCurrency(totalValue)}
					</p>
				</div>

				<div className='border-t' />

				<div className='flex-1 overflow-auto space-y-2 text-sm pr-1'>
					{recentProducts.length === 0 ? (
						<p className='text-muted-foreground text-sm'>
							No hay productos cargados.
						</p>
					) : (
						recentProducts.map((product) => (
							<div
								key={product.id}
								className='flex justify-between items-center'
							>
								<span className='truncate'>{product.name}</span>
								<span className='text-muted-foreground'>
									{formatCurrency(product.price)}
								</span>
							</div>
						))
					)}
				</div>
				<div className='mt-4 border-t pt-4 space-y-3'>
					{totalProducts > recentProducts.length && (
						<p className='text-xs text-muted-foreground text-center'>
							+{totalProducts - recentProducts.length} productos más
						</p>
					)}

					<div className='flex justify-between items-center'>
						<Button size='sm' onClick={() => router.push('/products/new')}>
							+ Añadir
						</Button>

						<Button
							variant='ghost'
							size='sm'
							onClick={() => router.push('/products')}
						>
							Ver todos
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
