'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProducts, useUpdateProduct } from '@/lib/queries';
import ProductForm from '../components/ProductForm';
import Loader from '@/components/ui/Loader';

export default function EditProductPage() {
	const { id } = useParams();
	const router = useRouter();

	const { data: products = [], isLoading } = useProducts();
	const { mutate: updateProduct } = useUpdateProduct();

	if (isLoading) {
		return <Loader text='Cargando producto...' />;
	}

	const product = products.find((p) => p.id === id);

	if (!product) {
		return <p>Producto no encontrado</p>;
	}

	return (
		<div className='space-y-6'>
			<h1 className='text-2xl font-semibold'>Editar Producto</h1>

			<ProductForm
				initialData={{
					name: product.name ?? '',
					description: product.description ?? '',
					brand: product.brand ?? '',
					gender: product.gender ?? '',
					imageUrl: product.imageUrl ?? '',
					price: String(product.price ?? ''),
					categoryId: product.categoryId ?? '',
				}}
				onSubmit={(formData) => {
					updateProduct(
						{
							id: product.id,
							payload: {
								...formData,
								price: Number(formData.price),
							},
						},
						{
							onSuccess: () => router.push('/products'),
						},
					);
				}}
			/>
		</div>
	);
}
