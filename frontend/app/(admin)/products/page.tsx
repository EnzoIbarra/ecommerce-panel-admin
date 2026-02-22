import { Button } from '@/components/ui/Button';
import ProductsTable from './components/ProductsTable';

export default function ProductsPage() {
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-semibold'>Productos</h1>

				<Button asChild>
					<a href='/products/new'>+ Nuevo Producto</a>
				</Button>
			</div>

			<ProductsTable />
		</div>
	);
}
