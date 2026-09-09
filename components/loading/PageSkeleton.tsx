import { SkeletonStatus } from './SkeletonStatus';

// Generic page placeholder for non-docs routes (home, donate, contributors).
// Neutral prose shape: honest for every target page, unlike a fake hero.
export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24" role="status" aria-busy="true">
      <SkeletonStatus />
      <div className="skeleton-in space-y-4" aria-hidden>
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton h-10 w-4/5 rounded-full" />
        <div className="skeleton h-10 w-2/5 rounded-full" />
        <div className="space-y-2.5 pt-2">
          <div className="skeleton h-3.5 w-full rounded-full" />
          <div className="skeleton h-3.5 w-full rounded-full" />
          <div className="skeleton h-3.5 w-3/5 rounded-full" />
        </div>
        <div className="flex gap-3 pt-4">
          <div className="skeleton h-10 w-28 rounded-full" />
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
