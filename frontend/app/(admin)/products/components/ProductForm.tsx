'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCategories } from '@/lib/queries';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

type ProductFormData = {
	name: string;
	description: string;
	brand: string;
	gender: string;
	imageUrl: string;
	price: string;
	categoryId: string;
};

type Props = {
	initialData?: Partial<ProductFormData>;
	onSubmit?: (data: ProductFormData) => void;
};

export default function ProductForm({ initialData, onSubmit }: Props) {
	const router = useRouter();
	const { data: categories = [] } = useCategories();

	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);

	const [form, setForm] = useState<ProductFormData>(() => ({
		name: initialData?.name ?? '',
		description: initialData?.description ?? '',
		brand: initialData?.brand ?? '',
		gender: initialData?.gender ?? '',
		imageUrl: initialData?.imageUrl ?? '',
		price: initialData?.price !== undefined ? String(initialData.price) : '',
		categoryId: initialData?.categoryId ?? '',
	}));

	const handleChange = (field: keyof ProductFormData, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			setUploading(true);

			const fileName = `${Date.now()}-${file.name}`;

			const { error } = await supabase.storage
				.from('products')
				.upload(fileName, file);

			if (error) throw error;

			const { data } = supabase.storage.from('products').getPublicUrl(fileName);

			handleChange('imageUrl', data.publicUrl);
		} catch (err) {
			console.error('Error uploading image:', err);
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);

			if (onSubmit) {
				onSubmit(form);
				return;
			}

			await api.post('/products', {
				...form,
				price: Number(form.price),
			});

			router.push('/products');
		} finally {
			setLoading(false);
		}
	};

	const isEditing = Boolean(initialData);

	return (
		<div className='max-w-3xl space-y-8'>
			<div className='space-y-6'>
				<h2 className='text-lg font-semibold'>
					Información Básica del Producto
				</h2>

				<div className='space-y-1'>
					<label className='text-sm font-medium'>Nombre</label>
					<Input
						value={form.name}
						onChange={(e) => handleChange('name', e.target.value)}
					/>
				</div>

				<div className='space-y-1'>
					<label className='text-sm font-medium'>Descripción</label>
					<textarea
						className='w-full rounded-md border p-2 text-sm'
						value={form.description}
						onChange={(e) => handleChange('description', e.target.value)}
					/>
				</div>

				<div className='space-y-1'>
					<label className='text-sm font-medium'>Marca</label>
					<Input
						value={form.brand}
						onChange={(e) => handleChange('brand', e.target.value)}
					/>
				</div>

				<div className='space-y-1'>
					<label className='text-sm font-medium'>Género</label>
					<Input
						value={form.gender}
						onChange={(e) => handleChange('gender', e.target.value)}
					/>
				</div>

				<div className='space-y-1'>
					<label className='text-sm font-medium'>
						URL Imagen o subir archivo
					</label>
					<Input
						value={form.imageUrl}
						onChange={(e) => handleChange('imageUrl', e.target.value)}
					/>
					<div className='space-y-2'>
						<label
							htmlFor='imageUpload'
							className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted transition-colors'
						>
							<div className='flex flex-col items-center justify-center pt-5 pb-6'>
								<svg
									className='w-8 h-8 mb-3 text-muted-foreground'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M7 16V8m0 0l-3 3m3-3l3 3m4 4v-8m0 0l-3 3m3-3l3 3'
									/>
								</svg>
								<p className='text-sm text-muted-foreground'>
									<span className='font-medium'>Click para subir</span> o
									arrastrar
								</p>
								<p className='text-xs text-muted-foreground'>PNG, JPG, WEBP</p>
							</div>
							<input
								id='imageUpload'
								type='file'
								accept='image/*'
								onChange={handleUpload}
								className='hidden'
							/>
						</label>

						{form.imageUrl && (
							<p className='text-xs text-muted-foreground truncate'>
								Imagen cargada correctamente
							</p>
						)}
					</div>
					{uploading && (
						<p className='text-xs text-muted-foreground'>Subiendo imagen...</p>
					)}
				</div>

				<div className='space-y-1'>
					<label className='text-sm font-medium'>Precio</label>
					<Input
						type='number'
						value={form.price}
						onChange={(e) => handleChange('price', e.target.value)}
					/>
				</div>

				<div className='space-y-1'>
					<label className='text-sm font-medium'>Categoría</label>
					<select
						className='w-full rounded-md border p-2 text-sm'
						value={form.categoryId}
						onChange={(e) => handleChange('categoryId', e.target.value)}
					>
						<option value=''>Seleccionar categoría</option>
						{categories.map((cat) => (
							<option key={cat.id} value={cat.id}>
								{cat.name}
							</option>
						))}
					</select>
				</div>

				<Button onClick={handleSubmit} disabled={loading || uploading}>
					{loading
						? 'Guardando...'
						: isEditing
							? 'Actualizar Producto'
							: 'Crear Producto'}
				</Button>
			</div>
		</div>
	);
}
