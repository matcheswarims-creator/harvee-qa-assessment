// Parses "$29.99" or "Total: $29.99" into cents so totals are compared without float errors.
export function toCents(text: string | null): number {
  const match = text?.match(/\$(\d+\.\d{2})/);
  if (!match) throw new Error(`Unable to parse amount: ${text}`);
  return Math.round(Number(match[1]) * 100);
}

export const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;
