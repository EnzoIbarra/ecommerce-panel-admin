'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export type Product = {
	id: string;
	name: string;
	description?: string | null;
	brand?: string | null;
	gender?: string | null;
	imageUrl?: string | null;
	price: number;
	categoryId: string;
	category?: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
};

export type SaleItem = {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	subtotal: number;
};

export type Sale = {
	id: string;
	orderNumber: string;
	customerEmail: string;
	total: number;
	status: string;
	paymentStatus: string;
	createdAt: string;
	items: SaleItem[];
	customerName: string;
	paymentMethod: string;
	shippingAddress: string;
};

export type Category = {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	products: { id: string }[];
};

export function useProducts() {
	return useQuery<Product[]>({
		queryKey: ['products'],
		queryFn: async () => {
			const { data } = await api.get('/products');
			return data;
		},
	});
}

export function useSales() {
	return useQuery<Sale[]>({
		queryKey: ['sales'],
		queryFn: async () => {
			const { data } = await api.get('/sales');
			return data;
		},
	});
}

export function useCategories() {
	return useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const { data } = await api.get('/categories');
			return data;
		},
	});
}

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: { name: string }) => {
			const { data } = await api.post('/categories', payload);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const { data } = await api.patch(`/categories/${id}`, { name });
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`/categories/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] });
		},
	});
}

export function useDeleteProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`/products/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
}

export function useUpdateProduct() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string;
			payload: Partial<Product>;
		}) => {
			const { data } = await api.patch(`/products/${id}`, payload);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
}

export function useCreateSale() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: {
			customerName: string;
			customerEmail: string;
			shippingAddress: string;
			items: { productId: string; quantity: number }[];
		}) => {
			const { data } = await api.post('/sales', payload);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sales'] });
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
}

export function useUpdateSaleStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, status }: { id: string; status: string }) => {
			const { data } = await api.patch(`/sales/${id}/status`, { status });
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['sales'] });
		},
	});
}
