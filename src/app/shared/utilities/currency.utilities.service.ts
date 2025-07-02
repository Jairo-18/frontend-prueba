export function formatCop(value: string | number): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  const formattedNumber = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);

  return `${formattedNumber}\u00A0COP`;
}
