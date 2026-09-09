import { SkeletonStatus } from './SkeletonStatus';

// Width classes are literals so Tailwind's scanner keeps them in the build.
const SIDEBAR_GROUPS: { items: string[]; active?: number }[] = [
  { items: ['w-28', 'w-24', 'w-32', 'w-20', 'w-28'] },
  { items: ['w-24', 'w-32', 'w-28', 'w-20'], active: 1 },
  { items: ['w-28', 'w-24', 'w-24', 'w-32', 'w-20', 'w-28'] },
  { items: ['w-24', 'w-28', 'w-20'] },
];

const TOC_ITEMS = ['w-32', 'w-24', 'w-28', 'w-20', 'w-24'];

// Route-transition placeholder for the docs catch-all. Mirrors DocsShell's
// three-column layout (sidebar w-60 / article max-w-3xl / toc w-48) so the
// swap from skeleton to real content causes no layout jump. The one
// accent-tinted sidebar row echoes the real active-item indicator.
export function DocsSkeleton() {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10" role="status" aria-busy="true">
      <SkeletonStatus />

      <aside className="skeleton-in hidden w-60 shrink-0 space-y-6 md:block" aria-hidden>
        {SIDEBAR_GROUPS.map((group, gi) => (
          <div key={gi}>
            <div className="skeleton h-3 w-20 rounded-full" />
            <ul className="mt-2 space-y-1 border-l border-edge">
              {group.items.map((w, i) => (
                <li
                  key={i}
                  className={`px-3 py-1.5 ${group.active === i ? '-ml-[1px] border-l-2 border-accent' : ''}`}
                >
                  <div className={`skeleton h-3 rounded-full ${w} ${group.active === i ? 'bg-accent/25' : ''}`} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <div className="skeleton-in min-w-0 flex-1 [animation-delay:80ms]" aria-hidden>
        <div className="skeleton h-3 w-36 rounded-full" />
        <div className="mt-6 max-w-3xl space-y-5">
          <div className="skeleton h-9 w-3/4 rounded-full" />
          <div className="space-y-2.5">
            <div className="skeleton h-3.5 w-full rounded-full" />
            <div className="skeleton h-3.5 w-full rounded-full" />
            <div className="skeleton h-3.5 w-4/5 rounded-full" />
          </div>
          <div className="skeleton h-36 rounded-code" />
          <div className="skeleton h-5 w-40 rounded-full" />
          <div className="space-y-2.5">
            <div className="skeleton h-3.5 w-full rounded-full" />
            <div className="skeleton h-3.5 w-full rounded-full" />
            <div className="skeleton h-3.5 w-2/3 rounded-full" />
          </div>
        </div>
      </div>

      <aside className="skeleton-in hidden w-48 shrink-0 space-y-3 [animation-delay:160ms] lg:block" aria-hidden>
        <div className="skeleton h-3 w-16 rounded-full" />
        {TOC_ITEMS.map((w, i) => (
          <div key={i} className={`skeleton h-3 rounded-full ${w} ${i > 2 ? 'ml-3' : ''}`} />
        ))}
      </aside>
    </div>
  );
}
