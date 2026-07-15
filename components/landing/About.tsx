'use client';

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import { Layers, GitBranch, Shield, Eye, Zap, Cpu } from 'lucide-react';

export function About() {
  const t = useTranslations('about');
  const reduce = useReducedMotion();

  const layers = [
    { icon: Cpu, key: 'l1', title: 'L1 Delivery', en: 'CLI / Web Studio / SDK' },
    { icon: GitBranch, key: 'l2', title: 'L2 Orchestration', en: 'YAML DSL → LangGraph' },
    { icon: Layers, key: 'l3', title: 'L3 Capabilities', en: 'Research / Execution Atoms' },
    { icon: Zap, key: 'l4', title: 'L4 Foundation', en: 'ModelRouter / MCPBus / RAG' },
    { icon: Shield, key: 'l5', title: 'L5 Persistence', en: 'Checkpoint / Session / Artifact' },
    { icon: Eye, key: 'l6', title: 'L6 Observability', en: 'LangSmith / OTel Trace' },
  ];

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-content-secondary">
            {t('tagline')}
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 space-y-4 text-content-secondary"
        >
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p>{t('p3')}</p>
        </motion.div>

        <div className="mt-16">
          <h3 className="mb-8 text-center text-xl font-semibold text-content-primary">
            {t('archTitle')}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.key}
                initial={reduce ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-card border border-edge bg-bg-elevated p-4"
              >
                <layer.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <div className="text-sm font-semibold text-content-primary">{layer.title}</div>
                  <div className="text-xs text-content-muted">{layer.en}</div>
                  <div className="mt-1 text-sm text-content-secondary">{t(layer.key)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 rounded-card border border-edge bg-bg-elevated p-6"
        >
          <p className="text-sm text-content-secondary">{t('differentiator')}</p>
        </motion.div>
      </div>
    </section>
  );
}
