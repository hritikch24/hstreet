import Link from 'next/link';
import { Fragment } from 'react';

/**
 * Renders a copy string, turning [label](/path) into an internal link.
 * Copy stays in plain strings in copy/*.ts; this is the only markup it has.
 */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        return (
          <Link key={i} href={m[2]}>
            {m[1]}
          </Link>
        );
      })}
    </>
  );
}

export function Paras({ paras, list }: { paras: string[]; list?: string[] }) {
  return (
    <div className="prose-shop max-w-[68ch]">
      {paras.map((p) => (
        <p key={p}>
          <Inline text={p} />
        </p>
      ))}
      {list && (
        <ul>
          {list.map((li) => (
            <li key={li}>
              <Inline text={li} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
