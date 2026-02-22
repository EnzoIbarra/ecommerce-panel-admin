'use client';

import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './Dialog';
import { Button } from './Button';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	onConfirm: () => void;
	isLoading?: boolean;
};

export default function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
	isLoading = false,
}: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				{description && (
					<p className='text-sm text-muted-foreground'>{description}</p>
				)}

				<div className='flex justify-end gap-2 mt-6'>
					<Button className='bg-stone-500 hover:bg-black border-none border-stone-500' onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>

					<Button
                    className='hover:bg-red-700'
						variant='destructive'
						onClick={onConfirm}
						disabled={isLoading}
					>
						Eliminar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
