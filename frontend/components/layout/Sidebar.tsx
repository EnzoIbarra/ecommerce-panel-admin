'use client';

import Link from 'next/link';
import { Home, ShoppingCart, Package, Shapes } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
	{ href: '/dashboard', label: 'Inicio', icon: Home },
	{ href: '/sales', label: 'Ventas', icon: ShoppingCart },
	{ href: '/products', label: 'Productos', icon: Package },
	{ href: '/categories', label: 'Categorias', icon: Shapes },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className='w-64 border-r bg-background p-4 hidden md:block'>
			<h2 className='text-lg font-semibold mb-6'>Tennis Star</h2>

			<nav className='space-y-2'>
				{links.map((link) => {
					const Icon = link.icon;
					const active = pathname === link.href;

					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
								active
									? 'bg-primary text-primary-foreground'
									: 'hover:bg-muted',
							)}
						>
							<Icon size={18} />
							{link.label}
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
