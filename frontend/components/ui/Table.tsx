'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type Column<T> = {
	header: string;
	accessor: keyof T;
	className?: string;
	render?: (row: T, index: number) => ReactNode;
};

type TableProps<T> = {
	data: T[];
	columns: Column<T>[];
	emptyMessage?: string;
};

export function Table<T extends { id: string }>({
	data,
	columns,
	emptyMessage = 'No hay datos disponibles.',
}: TableProps<T>) {
	return (
		<div className='rounded-xl border bg-card overflow-hidden'>
			<table className='w-full text-sm'>
				<thead className='bg-muted/40'>
					<tr>
						{columns.map((column, index) => (
							<th
								key={index}
								className={cn(
									'px-4 py-3 text-left font-medium text-muted-foreground',
									column.className,
								)}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{data.length === 0 ? (
						<tr>
							<td
								colSpan={columns.length}
								className='text-center py-6 text-muted-foreground'
							>
								{emptyMessage}
							</td>
						</tr>
					) : (
						data.map((row, rowIndex) => (
							<tr
								key={row.id}
								className='border-t hover:bg-muted/30 transition-colors'
							>
								{columns.map((column, colIndex) => (
									<td
										key={colIndex}
										className={cn('px-4 py-3', column.className)}
									>
										{column.render
											? column.render(row, rowIndex)
											: String(row[column.accessor] ?? '')}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
