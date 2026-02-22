import InventoryCard from './components/InventoryCard';
import RecentSalesCard from './components/RecentSalesCard';
import TopProductsCard from './components/TopProductsCard';

export default function DashboardPage() {
	return (
		<div className='grid gap-6 md:grid-cols-3'>
			<InventoryCard />
			<RecentSalesCard />
			<TopProductsCard />
		</div>
	);
}
