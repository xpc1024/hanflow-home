import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'donate' });

  const cards = [
    { key: 'wechat', src: '/donate/wx.jpg', alt: 'WeChat Pay QR' },
    { key: 'alipay', src: '/donate/zfb.jpg', alt: 'Alipay QR' },
  ] as const;

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 md:py-28">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-prose text-content-secondary">{t('subtitle')}</p>
      </div>

      <div className="mt-8 rounded-card border border-edge bg-bg-elevated p-6 text-center">
        <p className="text-base text-content-secondary">{t('message')}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.key} className="flex flex-col items-center rounded-card border border-edge bg-bg-elevated p-6">
            <div className="relative w-64 h-64 overflow-hidden rounded-lg">
              <Image
                src={c.src}
                alt={t(c.key)}
                fill
                className="object-contain"
                sizes="256px"
              />
            </div>
            <div className="mt-4 text-sm font-medium">{t(c.key)}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-card border border-edge bg-bg-elevated p-6 text-center">
        <div className="font-mono text-xs uppercase tracking-wider text-content-muted">{t('contact')}</div>
        <p className="mt-2 text-sm text-content-secondary">{t('thanks')}</p>
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}
