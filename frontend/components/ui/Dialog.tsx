'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dialog({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger {...props} />;
}

export function DialogContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Overlay className='fixed inset-0 bg-black/40 backdrop-blur-sm' />

			<DialogPrimitive.Content
				className={cn(
					'fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card p-6 shadow-lg outline-none',
					className,
				)}
				{...props}
			>
				{children}

				<DialogPrimitive.Close className='absolute right-4 top-4 text-muted-foreground hover:text-foreground transition'>
					<X size={16} />
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
}

export function DialogHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn('mb-4 space-y-1', className)} {...props} />;
}

export function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			className={cn('text-lg font-semibold', className)}
			{...props}
		/>
	);
}
