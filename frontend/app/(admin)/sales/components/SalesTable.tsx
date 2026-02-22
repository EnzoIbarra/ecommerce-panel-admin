'use client';

import { useState } from 'react';
import { useSales, Sale } from '@/lib/queries';
import { Table, Column } from '@/components/ui/Table';
import { formatCurrency } from '@/lib/format';
import Loader from '@/components/ui/Loader';
import ManageSaleDialog from './ManageSaleDialog';

function getInitials(name: string) {
	if (!name) return 'CL';

	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

function StatusBadge({ status }: { status: string }) {
	const styles: Record<string, string> = {
		PREPARING: 'bg-yellow-100 text-yellow-700',
		SENT: 'bg-blue-100 text-blue-700',
		COMPLETED: 'bg-green-100 text-green-700',
		CANCELLED: 'bg-red-100 text-red-700',
	};

	const labels: Record<string, string> = {
		PREPARING: 'En Preparación',
		SENT: 'Enviado',
		COMPLETED: 'Completado',
		CANCELLED: 'Cancelado',
	};

	return (
		<span
			className={`px-2 py-1 text-xs rounded-md font-medium ${
				styles[status] ?? 'bg-muted'
			}`}
		>
			{labels[status] ?? status}
		</span>
	);
}

function PaymentBadge({ status }: { status: string }) {
	const styles: Record<string, string> = {
		PAID: 'bg-green-100 text-green-700',
		FAILED: 'bg-red-100 text-red-700',
		PENDING: 'bg-yellow-100 text-yellow-700',
	};

	const labels: Record<string, string> = {
		PAID: 'Pagado',
		FAILED: 'Fallido',
		PENDING: 'Pendiente',
	};

	return (
		<span
			className={`px-2 py-1 text-xs rounded-md font-medium ${
				styles[status] ?? 'bg-muted'
			}`}
		>
			{labels[status] ?? status}
		</span>
	);
}

export default function SalesTable() {
	const { data = [], isLoading } = useSales();
	const [search, setSearch] = useState('');

	if (isLoading) return <Loader text='Cargando ventas...' />;

	const filtered = data.filter(
		(sale) =>
			sale.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
			sale.customerName.toLowerCase().includes(search.toLowerCase()),
	);

	const columns: Column<Sale>[] = [
		{
			header: 'Cliente',
			accessor: 'customerName',
			render: (sale) => (
				<div className='flex items-center gap-3'>
					<div className='w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium'>
						{getInitials(sale.customerName)}
					</div>
					<div>
						<p className='font-medium'>
							{sale.customerName ?? 'Cliente sin nombre'}
						</p>
						<p className='text-xs text-muted-foreground'>
							{sale.customerEmail ?? 'Sin email'}
						</p>
					</div>
				</div>
			),
		},
		{
			header: 'Número de Orden',
			accessor: 'orderNumber',
		},
		{
			header: 'Estado',
			accessor: 'status',
			render: (sale) => <StatusBadge status={sale.status} />,
		},
		{
			header: 'Pago',
			accessor: 'paymentStatus',
			render: (sale) => <PaymentBadge status={sale.paymentStatus} />,
		},
		{
			header: 'Total',
			accessor: 'total',
			render: (sale) => formatCurrency(sale.total),
		},
		{
			header: 'Acciones',
			accessor: 'id',
			className: 'text-right',
			render: (sale) => <ManageSaleDialog sale={sale} />,
		},
	];

	return (
		<div className='space-y-4'>
			<input
				placeholder='Buscar por nombre o número de orden...'
				className='w-full rounded-md border p-2 text-sm'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			<Table
				data={filtered}
				columns={columns}
				emptyMessage='No hay ventas registradas.'
			/>
		</div>
	);
}
