import { Loader2 } from 'lucide-react';

export default function Loader({ text }: { text?: string }) {
	return (
		<div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
			<Loader2 className='animate-spin mb-2' size={20} />
			{text && <p className='text-sm'>{text}</p>}
		</div>
	);
}
