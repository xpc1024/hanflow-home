import { DocsSkeleton } from '@/components/loading/DocsSkeleton';

// Suspense fallback for the docs catch-all. Covers both entry paths: navbar
// "Docs" clicks and in-docs sidebar navigation. The [locale] and docs
// layouts stay mounted, so only the DocsShell area swaps to the skeleton.
// The top progress bar is owned by NavProgress in the layout.
export default function DocsLoading() {
  return <DocsSkeleton />;
}
