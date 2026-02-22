'use client';

import { Bell, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const routeTitles: Record<string, string> = {
	'/dashboard': 'Inicio',
	'/sales': 'Ventas',
	'/products': 'Productos',
	'/categories': 'Categorías',
};

export default function Header() {
	const pathname = usePathname();

	const title = routeTitles[pathname] ?? '';

	return (
		<header className='h-16 border-b bg-background flex items-center justify-between px-6'>
			<div>
				<p className='text-xs text-muted-foreground'>Panel Administrativo</p>
				<h1 className='text-lg font-semibold'>{title}</h1>
			</div>

			<div className='flex items-center gap-3'>
				<Button variant='ghost' size='icon'>
					<Bell size={18} />
				</Button>

				<Button variant='ghost' size='icon'>
					<Sun size={18} />
				</Button>

				<div className='w-8 h-8 rounded-full bg-muted' />
			</div>
		</header>
	);
}
