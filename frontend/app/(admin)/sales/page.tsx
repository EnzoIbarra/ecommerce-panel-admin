'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import SalesTable from './components/SalesTable';

export default function SalesPage() {
	const router = useRouter();

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-semibold'>Ventas</h1>

				<Button onClick={() => router.push('/sales/new')}>
					+ Nuevo Pedido
				</Button>
			</div>

			<SalesTable />
		</div>
	);
}
