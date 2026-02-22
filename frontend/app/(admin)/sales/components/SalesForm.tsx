'use client';

import { useState } from 'react';
import { Product } from '@/lib/queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Props = {
	products: Product[];
	onSubmit: (items: { productId: string; quantity: number }[]) => void;
	isLoading?: boolean;
};

export default function SalesForm({
	products,
	onSubmit,
	isLoading = false,
}: Props) {
	const [items, setItems] = useState<{ productId: string; quantity: number }[]>(
		[],
	);

	const handleAddItem = () => {
		setItems([...items, { productId: '', quantity: 1 }]);
	};

	const handleChange = (
		index: number,
		field: 'productId' | 'quantity',
		value: string | number,
	) => {
		const updated = [...items];
		updated[index] = {
			...updated[index],
			[field]: value,
		};
		setItems(updated);
	};

	const handleSubmit = () => {
		onSubmit(items);
	};

	return (
		<div className='space-y-6'>
			{items.map((item, index) => (
				<div key={index} className='flex gap-3 items-center'>
					<select
						className='border rounded-md p-2 text-sm'
						value={item.productId}
						onChange={(e) => handleChange(index, 'productId', e.target.value)}
					>
						<option value=''>Seleccionar producto</option>
						{products.map((p) => (
							<option key={p.id} value={p.id}>
								{p.name}
							</option>
						))}
					</select>

					<Input
						type='number'
						min={1}
						value={item.quantity}
						onChange={(e) =>
							handleChange(index, 'quantity', Number(e.target.value))
						}
					/>
				</div>
			))}

			<div className='flex gap-2'>
				<Button variant='outline' onClick={handleAddItem}>
					Agregar Producto
				</Button>

				<Button
					onClick={handleSubmit}
					disabled={isLoading || items.length === 0}
				>
					{isLoading ? 'Creando...' : 'Crear Venta'}
				</Button>
			</div>
		</div>
	);
}
