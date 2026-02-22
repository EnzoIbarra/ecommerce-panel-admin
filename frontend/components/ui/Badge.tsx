import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('px-2 py-1 rounded-full text-xs font-medium', {
	variants: {
		variant: {
			preparing: 'bg-yellow-100 text-yellow-700',
			sent: 'bg-blue-100 text-blue-700',
			completed: 'bg-green-100 text-green-700',
			cancelled: 'bg-red-100 text-red-700',
		},
	},
});

type BadgeVariant = 'preparing' | 'sent' | 'completed' | 'cancelled';

type BadgeProps = {
	variant: BadgeVariant;
	label: string;
};

export default function Badge({ variant, label }: BadgeProps) {
	return <span className={cn(badgeVariants({ variant }))}>{label}</span>;
}
