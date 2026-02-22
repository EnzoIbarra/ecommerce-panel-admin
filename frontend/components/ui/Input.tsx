import * as React from 'react';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type = 'text', ...props }, ref) => {
		return (
			<input
				type={type}
				ref={ref}
				className={cn(
					'flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors',
					'focus:outline-none focus:ring-2 focus:ring-ring',
					'disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				{...props}
			/>
		);
	},
);

Input.displayName = 'Input';

export { Input };
