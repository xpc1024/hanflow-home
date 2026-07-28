'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { SourceDropdown } from './SourceDropdown';
import { VersionSelector } from './VersionSelector';
import { LocaleSwitch } from './LocaleSwitch';

export function NavbarClient({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-edge bg-bg-base/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="Hanflow">
          {/* Cyan SVG mark, not emoji (design 8.8). */}
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-accent" aria-hidden>
            <path
              d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          {/* 移动端显示缩写 HF (导航紧凑), 桌面端显示全名 Hanflow */}
          <span className="text-sm font-semibold tracking-tight sm:hidden">HF</span>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">Hanflow</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href={`/${locale}/docs/quick-start`}
            className="text-sm text-content-secondary hover:text-content-primary transition-colors"
          >
            {t('docs')}
          </Link>
          <SourceDropdown />
          <Link
            href={`/${locale}/donate`}
            className="text-sm text-content-secondary hover:text-content-primary transition-colors"
          >
            {t('donate')}
          </Link>
          <VersionSelector />
          <LocaleSwitch />
        </div>
      </nav>
    </header>
  );
}
