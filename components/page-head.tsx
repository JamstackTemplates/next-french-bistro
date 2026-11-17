import type { ReactNode } from 'react';

/** Heading block for inner pages: brass eyebrow, large display title and a lede, over a double brass rule. */
export function PageHead({ eyebrow, title, children, id, before }: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration above the eyebrow. */
  before?: ReactNode;
}) {
  return (
    <header className="wrap pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(1.5rem,3vw,2.25rem)]">
      {before}
      <p className="eyebrow">{eyebrow}</p>
      <h1 id={id} className="mt-3 mb-5 max-w-[20ch] text-[clamp(2.5rem,6vw,4.4rem)]">{title}</h1>
      {children ? <div className="max-w-(--measure) text-[clamp(1.05rem,1.5vw,1.18rem)] text-muted">{children}</div> : null}
      <div className="brass-rule mt-8" aria-hidden="true" />
    </header>
  );
}
