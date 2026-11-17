import type { ReactNode } from 'react';

/**
 * A Paris-style enamel street plaque used as a section heading: blue enamel, a white keyline, a green
 * frame and condensed capitals, with an optional small tab on top (a section number or a postcode).
 * Generic by design: never a real street's plaque.
 */
export function Plaque({ children, tab, as: Tag = 'h2', id, size = 'md', className = '' }: {
  children: ReactNode;
  /** Small tab above the plaque, e.g. "1" or "63104". */
  tab?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizes = { sm: 'text-[clamp(1.15rem,2.4vw,1.45rem)]', md: 'text-[clamp(1.45rem,3.4vw,2.1rem)]', lg: 'text-[clamp(1.7rem,4.6vw,2.8rem)]' };
  return (
    <Tag id={id} className={`plaque ${sizes[size]} ${tab ? 'mt-[.9em]' : ''} ${className}`}>
      {tab ? <span className="plaque__tab" aria-hidden="true">{tab}</span> : null}
      <span>{children}</span>
    </Tag>
  );
}
