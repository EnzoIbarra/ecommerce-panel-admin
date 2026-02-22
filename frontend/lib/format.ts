export function formatCurrency(value: number) {
	return new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		maximumFractionDigits: 0,
	}).format(value);
}

export function formatDate(date: string | Date) {
	const d = new Date(date);

	return d.toLocaleDateString('es-AR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	});
}
