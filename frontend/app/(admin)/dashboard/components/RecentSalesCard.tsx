'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useSales } from '@/lib/queries';
import Loader from '@/components/ui/Loader';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Sale } from '@/lib/queries';

const statusMap: Record<
	Sale['status'],
	'preparing' | 'sent' | 'completed' | 'cancelled'
> = {
	PREPARING: 'preparing',
	SENT: 'sent',
	COMPLETED: 'completed',
	CANCELLED: 'cancelled',
};

export default function RecentSalesCard() {
	const { data: sales = [], isLoading } = useSales();

	if (isLoading) {
		return (
			<Card>
				<Loader text='Cargando ventas...' />
			</Card>
		);
	}

	const recentSales = sales.slice(0, 5);

	return (
		<Card className='h-full flex flex-col'>
			<CardHeader>
				<CardTitle>Ventas Recientes</CardTitle>
			</CardHeader>

			<CardContent className='flex-1 overflow-auto space-y-4'>
				{recentSales.length === 0 ? (
					<p className='text-sm text-muted-foreground'>
						No hay ventas registradas.
					</p>
				) : (
					recentSales.map((sale) => (
						<div key={sale.id} className='rounded-xl border p-4 space-y-2'>
							<div className='flex justify-between items-start'>
								<div>
									<p className='font-semibold'>
										{sale.customerName ?? 'Cliente'}
									</p>
									<p className='text-xs text-muted-foreground'>
										Order #{sale.orderNumber}
									</p>
								</div>

								<div className='text-right'>
									<p className='font-bold text-lg'>
										{formatCurrency(sale.total)}
									</p>
									<p className='text-xs text-muted-foreground'>
										{formatDate(sale.createdAt)}
									</p>
								</div>
							</div>

							<div>
								<Badge variant={statusMap[sale.status]} label={sale.status} />
							</div>
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}
