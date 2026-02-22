import CreateCategoryDialog from './components/CreateCategoryDialog';
import CategoriesTable from './components/CategoriesTable';

export default function CategoriesPage() {
	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-semibold'>Categorías</h1>
				<CreateCategoryDialog />
			</div>

			<CategoriesTable />
		</div>
	);
}
