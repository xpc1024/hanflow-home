import { PageSkeleton } from '@/components/loading/PageSkeleton';

// Suspense fallback for non-docs pages under /[locale] (home, donate,
// contributors). The navbar and footer live in the [locale] layout, so they
// stay visible while this placeholder occupies the content area. The top
// progress bar is owned by NavProgress in the layout, not by this fallback.
export default function LocaleLoading() {
  return <PageSkeleton />;
}
