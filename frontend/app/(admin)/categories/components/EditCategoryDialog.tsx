'use client';

import { useState } from 'react';
import { Category, useUpdateCategory } from '@/lib/queries';
import { Button } from '@/components/ui/Button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Pencil } from 'lucide-react';

type Props = {
	category: Category;
};

export default function EditCategoryDialog({ category }: Props) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(category.name);

	const { mutate, isPending } = useUpdateCategory();

	const handleUpdate = () => {
		if (!name.trim()) return;

		mutate(
			{ id: category.id, name },
			{
				onSuccess: () => {
					setOpen(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size='icon' variant='ghost'>
					<Pencil size={16} />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editar Categoría</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					<Input value={name} onChange={(e) => setName(e.target.value)} />

					<Button
						className='w-full'
						onClick={handleUpdate}
						disabled={isPending}
					>
						Guardar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
