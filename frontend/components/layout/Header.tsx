'use client';

import { Bell, Sun, Moon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const routeTitles: Record<string, string> = {
	'/dashboard': 'Inicio',
	'/sales': 'Ventas',
	'/products': 'Productos',
	'/categories': 'Categorías',
};

function getInitialTheme(): boolean {
	if (typeof window === 'undefined') return false;

	const storedTheme = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

	return storedTheme === 'dark' || (!storedTheme && prefersDark);
}

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const title = routeTitles[pathname] ?? '';

	const [open, setOpen] = useState(false);
	const [isDark, setIsDark] = useState(getInitialTheme);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDark]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const toggleTheme = () => {
		setIsDark((prev) => {
			const next = !prev;
			localStorage.setItem('theme', next ? 'dark' : 'light');
			return next;
		});
	};

	const handleLogout = () => {
		document.cookie = 'auth_token=; path=/; max-age=0;';
		router.push('/login');
	};

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

				<Button variant='ghost' size='icon' onClick={toggleTheme}>
					{isDark ? <Sun size={18} /> : <Moon size={18} />}
				</Button>

				<div className='relative' ref={dropdownRef}>
					<button
						onClick={() => setOpen(!open)}
						className='w-8 h-8 rounded-full overflow-hidden border'
					>
						<Image
							src='/EnzoIcon.webp'
							alt='Perfil'
							width={32}
							height={32}
							className='object-cover'
						/>
					</button>

					{open && (
						<div className='absolute right-0 mt-2 w-44 rounded-xl border bg-background shadow-md p-2 z-50'>
							<button
								onClick={handleLogout}
								className='w-full text-left text-sm px-3 py-2 rounded-md hover:bg-red-400/50 transition-colors'
							>
								Cerrar sesión
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
