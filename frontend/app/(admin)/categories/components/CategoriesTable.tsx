'use client';

import { useState } from 'react';
import { Table, Column } from '@/components/ui/Table';
import { Category, useCategories, useDeleteCategory } from '@/lib/queries';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import EditCategoryDialog from './EditCategoryDialog';
import Loader from '@/components/ui/Loader';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function CategoriesTable() {
	const { data = [], isLoading } = useCategories();
	const { mutate: deleteCategory, isPending } = useDeleteCategory();

	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);

	if (isLoading) {
		return <Loader text='Cargando categorías...' />;
	}

	const columns: Column<Category>[] = [
		{
			header: 'Posición',
			accessor: 'id',
			render: (_, index: number) => index + 1,
		},
		{
			header: 'Nombre',
			accessor: 'name',
		},
		{
			header: 'Subcategorías',
			accessor: 'products',
			render: (category) => `${category.products?.length ?? 0} subcategorías`,
		},
		{
			header: 'Categoría Padre',
			accessor: 'id',
			render: () => (
				<span className='text-blue-900 font-medium px-2 py-1 text-xs rounded-md bg-sky-100 border-2 border-sky-200'>Principal</span>
			),
		},
		{
			header: 'Acciones',
			accessor: 'id',
			className: 'text-right',
			render: (category) => (
				<div className='flex justify-end gap-2'>
					<EditCategoryDialog category={category} />

					<Button
						size='icon'
						variant='ghost'
						onClick={() => setSelectedCategory(category)}
					>
						<Trash2 size={16} className='text-red-600' />
					</Button>
				</div>
			),
		},
	];

	const handleConfirmDelete = () => {
		if (!selectedCategory) return;

		deleteCategory(selectedCategory.id, {
			onSuccess: () => {
				setSelectedCategory(null);
			},
		});
	};

	return (
		<>
			<Table
				data={data}
				columns={columns}
				emptyMessage='No hay categorías creadas.'
			/>

			<ConfirmDialog
				open={!!selectedCategory}
				onOpenChange={() => setSelectedCategory(null)}
				title='¿Eliminar categoría?'
				description={`Esta acción eliminará la categoría "${selectedCategory?.name}".`}
				onConfirm={handleConfirmDelete}
				isLoading={isPending}
			/>
		</>
	);
}
