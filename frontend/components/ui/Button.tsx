'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:opacity-90',
				outline: 'border border-border bg-background hover:bg-muted',
				ghost: 'hover:bg-muted',
				destructive: 'bg-destructive text-white hover:opacity-90',
			},
			size: {
				default: 'h-10 px-4',
				sm: 'h-9 px-3 text-xs',
				lg: 'h-11 px-6 text-base',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';

		return (
			<Comp
				className={cn(buttonVariants({ variant, size }), className)}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = 'Button';

export { Button, buttonVariants };
