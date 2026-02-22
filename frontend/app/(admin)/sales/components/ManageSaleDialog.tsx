'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useUpdateSaleStatus, Sale } from '@/lib/queries';
import { formatCurrency, formatDate } from '@/lib/format';

type Props = {
	sale: Sale;
};

export default function ManageSaleDialog({ sale }: Props) {
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState(sale.status);
	const { mutate, isPending } = useUpdateSaleStatus();

	return (
		<>
			<Button size='sm' variant='outline' onClick={() => setOpen(true)}>
				Gestionar
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className='space-y-6 max-h-[90vh] overflow-y-auto w-full max-w-4xl no-scrollbar'>
					<DialogHeader>
						<DialogTitle>Gestionar Orden</DialogTitle>
					</DialogHeader>

					<div className='space-y-4'>
						<div>
							<p className='text-sm font-medium'>Número de Orden</p>
							<p className='text-muted-foreground'>{sale.orderNumber}</p>
						</div>

						<div className='space-y-1'>
							<label className='text-sm font-medium'>Cambiar Estado</label>

							<select
								className='w-full rounded-md border p-2 text-sm'
								value={selectedStatus}
								onChange={(e) =>
									setSelectedStatus(e.target.value as typeof sale.status)
								}
							>
								<option value='PREPARING'>En Preparación</option>
								<option value='SENT'>Enviado</option>
								<option value='COMPLETED'>Completado</option>
								<option value='CANCELLED'>Cancelado</option>
							</select>
						</div>

						<Button
							onClick={() =>
								mutate(
									{
										id: sale.id,
										status: selectedStatus,
									},
									{
										onSuccess: () => setOpen(false),
									},
								)
							}
							disabled={isPending}
						>
							{isPending ? 'Actualizando...' : 'Actualizar Estado'}
						</Button>
					</div>

					<div className='grid gap-4 md:grid-cols-2'>
						<div className='rounded-xl border p-4 space-y-2'>
							<h3 className='font-semibold text-sm'>Información del Cliente</h3>
							<p className='text-sm'>
								<strong>Nombre:</strong>{' '}
								{sale.customerName ?? 'No especificado'}
							</p>
							<p className='text-sm'>
								<strong>Email:</strong>{' '}
								{sale.customerEmail ?? 'No especificado'}
							</p>
						</div>

						<div className='rounded-xl border p-4 space-y-2'>
							<h3 className='font-semibold text-sm'>Información de Pago</h3>
							<p className='text-sm'>
								<strong>Método:</strong> {sale.paymentMethod ?? 'N/A'}
							</p>
							<p className='text-sm'>
								<strong>Estado:</strong> {sale.paymentStatus}
							</p>
							<p className='text-sm'>
								<strong>Total:</strong> {formatCurrency(sale.total)}
							</p>
						</div>
					</div>

					<div className='rounded-xl border p-4 space-y-3'>
						<h3 className='font-semibold text-sm'>Productos</h3>

						{sale.items.map((item) => (
							<div
								key={item.id}
								className='flex justify-between text-sm border-b pb-2 last:border-none'
							>
								<div>
									<p className='font-medium'>{item.productName}</p>
									<p className='text-muted-foreground'>
										Cantidad: {item.quantity}
									</p>
								</div>

								<p className='font-medium'>{formatCurrency(item.subtotal)}</p>
							</div>
						))}
					</div>

					<div className='rounded-xl border p-4 space-y-2'>
						<h3 className='font-semibold text-sm'>Información de Envío</h3>
						<p className='text-sm'>
							<strong>Dirección:</strong>{' '}
							{sale.shippingAddress ?? 'No especificada'}
						</p>
						<p className='text-sm'>
							<strong>Fecha:</strong> {formatDate(sale.createdAt)}
						</p>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
