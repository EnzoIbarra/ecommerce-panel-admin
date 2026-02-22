'use client';

import { motion } from 'framer-motion';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-muted/40 px-4'>
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: 'easeOut' }}
				className='w-full max-w-md bg-card border rounded-2xl shadow-sm p-8'
			>
				<LoginForm />
			</motion.div>
		</div>
	);
}
