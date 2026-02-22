'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AdminLayout({ children }: { children: ReactNode }) {
	const router = useRouter();
	const token = useAuthStore((state) => state.token);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');

		if (!token && !storedToken) {
			router.replace('/login');
		}
	}, [token, router]);

	return (
		<div className='min-h-screen bg-muted/30 flex'>
			<Sidebar />

			<div className='flex-1 flex flex-col'>
				<Header />
				<main className='p-6'>{children}</main>
			</div>
		</div>
	);
}
