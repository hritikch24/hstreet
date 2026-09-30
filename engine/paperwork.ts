/** Quote and invoice arithmetic. Everything is in whole pence. */
export interface Line {
  description: string;
  quantity: number;
  unitPence: number;
}

export function totals(lines: Line[], vatPercent: number) {
  const subtotalPence = lines.reduce((sum, l) => sum + Math.round(l.quantity * l.unitPence), 0);
  const vatPence = Math.round((subtotalPence * vatPercent) / 100);
  return { subtotalPence, vatPence, totalPence: subtotalPence + vatPence };
}

export function cleanLines(raw: unknown): Line[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => {
      const o = (r ?? {}) as Record<string, unknown>;
      return {
        description: String(o.description ?? '').trim().slice(0, 300),
        quantity: Math.max(0, Math.min(10000, Number(o.quantity) || 0)),
        unitPence: Math.max(0, Math.min(100_000_000, Math.round(Number(o.unitPence) || 0))),
      };
    })
    .filter((l) => l.description && l.quantity > 0)
    .slice(0, 50);
}
