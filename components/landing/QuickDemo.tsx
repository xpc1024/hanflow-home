'use client';

import { useTranslations } from 'next-intl';

const STEPS = [
  {
    key: 'clone' as const,
    cmd: 'git clone https://github.com/xpc1024/hanflow && cd hanflow',
  },
  {
    key: 'configure' as const,
    cmd: 'cp deploy/docker/hanflow.yaml.example hanflow.yaml\ncp deploy/docker/.env.example .env',
  },
  {
    key: 'run' as const,
    cmd: 'cd deploy/docker && docker compose up -d',
  },
];

export function QuickDemo() {
  const t = useTranslations('quickdemo');
  return (
    <section className="border-t border-edge py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{t('eyebrow')}</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{t('title')}</h2>

        <ol className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.key} className="rounded-card border border-edge bg-bg-elevated p-6">
              <div className="font-mono text-xs text-content-muted">0{i + 1}</div>
              <h3 className="mt-2 text-lg font-semibold">{t(`steps.${s.key}.title`)}</h3>
              <p className="mt-1 text-sm text-content-secondary">{t(`steps.${s.key}.desc`)}</p>
              <pre className="mt-4 overflow-x-auto rounded-code bg-bg-subtle p-3 font-mono text-xs text-content-secondary">
                <code>{s.cmd}</code>
              </pre>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
