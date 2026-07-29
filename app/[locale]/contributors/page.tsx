import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import path from 'node:path';
import { promises as fs } from 'node:fs';

interface Contribution {
  id: string;
  github_user: string;
  github_user_url: string;
  avatar_url: string;
  date: string;
  version: string;
  type: string; // feat | fix | docs | refactor | other
  summary: string;
  pr_url: string;
  pr_status: string; // open | merged | closed
  merged_at: string | null;
}

interface ContributorsData {
  contributions: Contribution[];
}

// type → 徽章样式 class (对齐官网 token)
const TYPE_BADGE: Record<string, string> = {
  feat: 'bg-emerald-500/10 text-emerald-500',
  fix: 'bg-orange-500/10 text-orange-500',
  docs: 'bg-sky-500/10 text-sky-500',
  refactor: 'bg-zinc-500/10 text-zinc-400',
};

export default async function ContributorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contributors' });

  // 读 data/contributors.json (SSG 构建时读)
  const dataPath = path.join(process.cwd(), 'data', 'contributors.json');
  let contributions: Contribution[] = [];
  try {
    const raw = await fs.readFile(dataPath, 'utf8');
    const data: ContributorsData = JSON.parse(raw);
    contributions = data.contributions || [];
  } catch {
    // 文件不存在或解析失败 → 空状态
    contributions = [];
  }

  // 时序倒序 (最新在上)
  const sorted = [...contributions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 md:py-28">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-prose text-content-secondary">{t('subtitle')}</p>
      </div>

      {sorted.length === 0 ? (
        // 空状态
        <div className="mt-12 rounded-card border border-edge bg-bg-elevated p-10 text-center">
          <p className="text-base text-content-secondary">{t('empty')}</p>
          <Link
            href={`/${locale}/docs/community/contribute-pr`}
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            {t('emptyCta')} →
          </Link>
        </div>
      ) : (
        // 桌面: 表格 / 移动: 卡片列表
        <>
          {/* 桌面表格 (≥md) */}
          <div className="mt-12 hidden overflow-hidden rounded-card border border-edge md:block">
            <table className="w-full text-sm">
              <thead className="bg-bg-subtle">
                <tr className="text-left text-xs uppercase tracking-wider text-content-muted">
                  <th className="px-4 py-3 font-medium">{t('col_date')}</th>
                  <th className="px-4 py-3 font-medium">{t('col_contributor')}</th>
                  <th className="px-4 py-3 font-medium">{t('col_version')}</th>
                  <th className="px-4 py-3 font-medium">{t('col_type')}</th>
                  <th className="px-4 py-3 font-medium">{t('col_summary')}</th>
                  <th className="px-4 py-3 font-medium">{t('col_pr')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {sorted.map((c) => (
                  <tr key={c.id} className="hover:bg-bg-subtle/50">
                    <td className="whitespace-nowrap px-4 py-3 text-content-secondary">{c.date}</td>
                    <td className="px-4 py-3">
                      <a
                        href={c.github_user_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-content-primary hover:text-accent"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.avatar_url}
                          alt={c.github_user}
                          className="h-6 w-6 rounded-full"
                          width={24}
                          height={24}
                        />
                        <span>@{c.github_user}</span>
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-content-secondary">v{c.version}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${TYPE_BADGE[c.type] || TYPE_BADGE.refactor}`}>
                        {t(`type_${c.type}` as never)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-content-primary">{c.summary}</td>
                    <td className="px-4 py-3">
                      <a
                        href={c.pr_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline"
                      >
                        ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 移动卡片列表 (<md) */}
          <div className="mt-12 space-y-4 md:hidden">
            {sorted.map((c) => (
              <div key={c.id} className="rounded-card border border-edge bg-bg-elevated p-4">
                <div className="flex items-center justify-between">
                  <a
                    href={c.github_user_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-content-primary"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.avatar_url}
                      alt={c.github_user}
                      className="h-6 w-6 rounded-full"
                      width={24}
                      height={24}
                    />
                    <span className="text-sm font-medium">@{c.github_user}</span>
                  </a>
                  <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${TYPE_BADGE[c.type] || TYPE_BADGE.refactor}`}>
                    {t(`type_${c.type}` as never)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-content-primary">{c.summary}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-content-muted">
                  <span>{c.date}</span>
                  <span>v{c.version}</span>
                  <a href={c.pr_url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    PR ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}
