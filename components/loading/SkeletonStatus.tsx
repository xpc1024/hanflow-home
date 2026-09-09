'use client';

import { useTranslations } from 'next-intl';

// Screen-reader-only status text announced while a route transition is in
// flight. Locale resolves through NextIntlClientProvider in the [locale]
// layout, which stays mounted across navigations.
export function SkeletonStatus() {
  const t = useTranslations('loading');
  return <span className="sr-only">{t('status')}</span>;
}
