'use client';

import { useState } from 'react';
import { useCreateCategory } from '@/lib/queries';
import { Button } from '@/components/ui/Button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';

export default function CreateCategoryDialog() {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');

	const { mutate, isPending } = useCreateCategory();

	const handleCreate = () => {
		if (!name.trim()) return;

		mutate(
			{ name },
			{
				onSuccess: () => {
					setName('');
					setOpen(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>+ Nueva Categoría</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nueva Categoría</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<Input
						placeholder='Nombre de la categoría'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<Button
						className='w-full'
						onClick={handleCreate}
						disabled={isPending}
					>
						Crear
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
