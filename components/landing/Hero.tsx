'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ThemeAwareImage } from '@/components/ui/ThemeAwareImage';

export function Hero({ locale }: { locale: string }) {
  const t = useTranslations('hero');
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
  };
  const item = reduce
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      };

  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="accent-glow pointer-events-none absolute right-0 top-0 h-[600px] w-[600px]"
        aria-hidden
      />
      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl grid-cols-1 items-center gap-12 px-4 pt-16 md:grid-cols-2 md:pt-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            {t('eyebrow')}
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-4 text-5xl font-bold leading-[1.05] tracking-tighter md:text-7xl"
          >
            {t('title')}
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-prose text-lg text-content-secondary">
            {t('subtitle')}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/docs/quick-start`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg-base shadow-[0_0_0_1px_var(--accent-glow)] transition-transform active:scale-[0.98]"
            >
              {t('ctaPrimary')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/xpc1024/hanflow"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-edge px-5 py-2.5 text-sm font-medium text-content-primary transition-colors hover:border-edge-bright"
            >
              {t('ctaSecondary')}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-card border border-edge bg-bg-elevated p-2 shadow-2xl"
        >
          <ThemeAwareImage src="/images/hero-canvas.svg" alt="Hanflow canvas preview" />
        </motion.div>
      </div>
    </section>
  );
}
