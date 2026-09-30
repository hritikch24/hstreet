'use client';

export function PrintThis() {
  return (
    <button type="button" className="btn btn-signal" onClick={() => window.print()}>
      Print or save as PDF
    </button>
  );
}
