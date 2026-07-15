import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');

  const docsLinks = [
    { href: `/${locale}/docs/quick-start`, label: t('docsLinks.quickStart') },
    { href: `/${locale}/docs/core-concepts/nodes`, label: t('docsLinks.coreConcepts') },
    { href: `/${locale}/docs/web-studio/build-mode`, label: t('docsLinks.webStudio') },
    { href: `/${locale}/docs/api-reference/rest`, label: t('docsLinks.apiReference') },
  ];

  return (
    <footer className="border-t border-edge bg-bg-base">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-16 md:grid-cols-4">
        <div>
          <div className="text-sm font-semibold">Hanflow</div>
          <div className="mt-1 text-sm text-content-muted">{t('tagline')}</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-content-muted">
            {t('docs')}
          </div>
          <ul className="mt-3 space-y-2">
            {docsLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-content-secondary hover:text-content-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-content-muted">
            {t('source')}
          </div>
          <ul className="mt-3 space-y-2">
            <li>
              <a href="https://github.com/xpc1024/hanflow" target="_blank" rel="noreferrer" className="text-sm text-content-secondary hover:text-content-primary">
                {t('github')}
              </a>
            </li>
            <li>
              <a href="https://gitee.com/easy-es/hanflow" target="_blank" rel="noreferrer" className="text-sm text-content-secondary hover:text-content-primary">
                {t('gitee')}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-content-muted">
            {t('donate')}
          </div>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href={`/${locale}/donate`} className="text-sm text-content-secondary hover:text-content-primary">
                {t('donate')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-content-muted md:flex-row">
          <span>{t('license')}</span>
          <span>{t('copyright')}</span>
        </div>
      </div>
    </footer>
  );
}
