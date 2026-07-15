import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { getRequestConfig } from 'next-intl/server';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && ['en', 'zh'].includes(requested) ? requested : 'en';
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
