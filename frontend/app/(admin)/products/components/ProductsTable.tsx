'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';

import { Table, Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Loader from '@/components/ui/Loader';

import { Product, useProducts, useDeleteProduct } from '@/lib/queries';
import { formatCurrency } from '@/lib/format';

export default function ProductsTable() {
	const { data = [], isLoading } = useProducts();
	const { mutate: deleteProduct, isPending } = useDeleteProduct();

	const router = useRouter();

	const [search, setSearch] = useState('');
	const [openConfirm, setOpenConfirm] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	if (isLoading) {
		return <Loader text='Cargando productos...' />;
	}

	const filteredData = data.filter((product) =>
		product.name.toLowerCase().includes(search.toLowerCase()),
	);

	const handleDelete = () => {
		if (!selectedId) return;
		deleteProduct(selectedId, {
			onSuccess: () => {
				setOpenConfirm(false);
				setSelectedId(null);
			},
		});
	};

	const columns: Column<Product>[] = [
		{
			header: '',
			accessor: 'imageUrl',
			render: (product) =>
				product.imageUrl ? (
					<Image
						src={product.imageUrl}
						alt={product.name}
						width={48}
						height={48}
						className='w-12 h-12 object-cover rounded-md'
					/>
				) : (
					<div className='w-12 h-12 bg-muted rounded-md' />
				),
		},
		{
			header: 'Nombre',
			accessor: 'name',
		},
		{
			header: 'Categoría',
			accessor: 'category',
			render: (product) => product.category?.name ?? '-',
		},
		{
			header: 'Marca',
			accessor: 'brand',
			render: (product) => product.brand ?? '-',
		},
		{
			header: 'Precio',
			accessor: 'price',
			render: (product) => formatCurrency(product.price),
		},
		{
			header: 'Stock',
			accessor: 'id',
			render: () => 'Disponible',
		},
		{
			header: 'Estado',
			accessor: 'id',
			render: () => (
				<span className='px-2 py-1 text-xs rounded-md bg-green-100 text-green-700'>
					Activo
				</span>
			),
		},
		{
			header: 'Acciones',
			accessor: 'id',
			className: 'text-right',
			render: (product) => (
				<div className='flex justify-end gap-2'>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => router.push(`/products/${product.id}`)}
					>
						<Pencil size={16} />
					</Button>

					<Button
						size='icon'
						variant='ghost'
						onClick={() => {
							setSelectedId(product.id);
							setOpenConfirm(true);
						}}
					>
						<Trash2 size={16} className='text-red-600' />
					</Button>
				</div>
			),
		},
	];

	return (
		<div className='space-y-4'>
			<input
				type='text'
				placeholder='Buscar producto...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className='w-full max-w-sm rounded-md border px-3 py-2 text-sm'
			/>

			<Table
				data={filteredData}
				columns={columns}
				emptyMessage='No hay productos creados.'
			/>

			<ConfirmDialog
				open={openConfirm}
				onOpenChange={setOpenConfirm}
				title='Eliminar producto'
				description='¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer.'
				onConfirm={handleDelete}
				isLoading={isPending}
			/>
		</div>
	);
}
