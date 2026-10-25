'use client';

export function PrintThis() {
  return (
    <button type="button" className="btn btn-accent" onClick={() => window.print()}>
      Print or save as PDF
    </button>
  );
}
