import type { SVGProps } from 'react';

const paths = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z" /><circle cx="12" cy="10" r="2.3" /></>,
  phone: <path d="M6.6 3.8 9 3.3l1.6 4-2 1.3a10.6 10.6 0 0 0 6.1 6.1l1.3-2 4 1.6-.5 2.4a2 2 0 0 1-2.1 1.6C10.4 17.8 6.2 13.6 5 6a2 2 0 0 1 1.6-2.2z" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 7 8 6 8-6" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
} as const;

export type IconName = keyof typeof paths;

/** Small line icons, drawn in the current text colour. Decorative unless given a title. */
export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}
