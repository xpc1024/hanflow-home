'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { DocSiblings } from '@/lib/docs';
import { LATEST_MAJOR } from '@/lib/versions';

export function DocsPager({
  siblings,
  locale,
  version,
}: {
  siblings: DocSiblings;
  locale: string;
  version: string; // 大版本线, 如 '1.x'; LATEST_MAJOR 时无前缀
}) {
  const t = useTranslations('docs');
  // LATEST 线不加前缀; 旧线加 <major>.x/ 前缀
  const prefix = version === LATEST_MAJOR ? '' : `${version}/`;
  return (
    <nav className="mt-16 flex items-center justify-between border-t border-edge pt-6">
      {siblings.previous ? (
        <Link
          href={`/${locale}/docs/${prefix}${siblings.previous.slug}`}
          className="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-content-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('previous')}: {siblings.previous.title}
        </Link>
      ) : (
        <span />
      )}
      {siblings.next ? (
        <Link
          href={`/${locale}/docs/${prefix}${siblings.next.slug}`}
          className="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-content-primary"
        >
          {t('next')}: {siblings.next.title}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
