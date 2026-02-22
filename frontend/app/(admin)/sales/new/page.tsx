'use client';

import { useRouter } from 'next/navigation';
import { useProducts, useCreateSale } from '@/lib/queries';
import Loader from '@/components/ui/Loader';
import SalesForm from '../components/SalesForm';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';

export default function NewSalePage() {
	const router = useRouter();
	const { data: products = [], isLoading } = useProducts();
	const { mutate, isPending } = useCreateSale();

	const [cliente, setCliente] = useState({
		nombre: '',
		email: '',
		direccion: '',
	});

	if (isLoading) return <Loader text='Cargando productos...' />;

	return (
		<div className='space-y-8 max-w-3xl'>
			<h1 className='text-2xl font-semibold'>Nuevo Pedido</h1>

			<div className='space-y-4 border rounded-xl p-4'>
				<h2 className='font-medium'>Información del Cliente</h2>

				<Input
					placeholder='Nombre'
					value={cliente.nombre}
					onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
				/>

				<Input
					placeholder='Email'
					value={cliente.email}
					onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
				/>

				<Input
					placeholder='Dirección'
					value={cliente.direccion}
					onChange={(e) =>
						setCliente({ ...cliente, direccion: e.target.value })
					}
				/>
			</div>

			<div className='border rounded-xl p-4'>
				<SalesForm
					products={products}
					isLoading={isPending}
					onSubmit={(items) =>
						mutate(
							{
								customerName: cliente.nombre,
								customerEmail: cliente.email,
								shippingAddress: cliente.direccion,
								items,
							},
							{
								onSuccess: () => router.push('/sales'),
							},
						)
					}
				/>
			</div>
		</div>
	);
}
