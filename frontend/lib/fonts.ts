import { Outfit, Inter } from 'next/font/google';

export const outfit = Outfit({
	subsets: ['latin'],
	variable: '--font-outfit',
});

export const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
});
