import path from 'node:path';
import { notFound } from 'next/navigation';
import { buildSidebarTree, readDoc, findDocSiblings } from '@/lib/docs';
import { resolveVersion, LATEST_MAJOR, MAJOR_VERSIONS } from '@/lib/versions';
import { DocsShell } from '@/components/docs/DocsShell';
import type { Crumb } from '@/components/docs/Breadcrumb';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export default async function DocPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug = [] } = await params;
  const { version, rest } = resolveVersion(slug);

  const doc = await readDoc(CONTENT_ROOT, version, locale, rest);
  if (!doc) notFound();

  const tree = buildSidebarTree(CONTENT_ROOT, version, locale);
  const activeSlug = rest.join('/');
  const siblings = findDocSiblings(tree, activeSlug);

  const crumbPrefix = version === LATEST_MAJOR ? '' : `${version}/`;
  const crumbs: Crumb[] = [
    { label: 'Docs', href: `/${locale}/docs/${crumbPrefix}quick-start` },
    ...rest.map((seg, i) => ({
      label: seg.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
      href: i === rest.length - 1 ? undefined : `/${locale}/docs/${crumbPrefix}${rest.slice(0, i + 1).join('/')}`,
    })),
  ];

  return (
    <DocsShell
      tree={tree}
      toc={doc.toc}
      siblings={siblings}
      activeSlug={activeSlug}
      locale={locale}
      version={version}
      crumbs={crumbs}
      source={doc.raw}
    />
  );
}

export async function generateStaticParams() {
  // 预渲染所有大版本线 × {en,zh} × 全部 slug, 让 1.x / 将来 2.x 都可真切换。
  const fs = await import('node:fs/promises');
  const out: { locale: string; slug: string[] }[] = [];
  for (const locale of ['en', 'zh']) {
    for (const ver of MAJOR_VERSIONS) {
      const dir = path.join(CONTENT_ROOT, ver, locale);
      let exists = true;
      try {
        await fs.access(dir);
      } catch {
        exists = false;
      }
      if (!exists) continue;
      const files = await walkMdx(dir);
      for (const rel of files) {
        // LATEST 线不加前缀; 旧线加 <major>.x/ 前缀
        if (ver === LATEST_MAJOR) {
          out.push({ locale, slug: rel });
        } else {
          out.push({ locale, slug: [ver, ...rel] });
        }
      }
    }
  }
  return out;
}

async function walkMdx(dir: string, base = dir): Promise<string[][]> {
  const fs = await import('node:fs/promises');
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[][] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkMdx(full, base)));
    } else if (e.name.endsWith('.mdx')) {
      const rel = path.relative(base, full).replace(/\.mdx$/, '').split(path.sep);
      out.push(rel);
    }
  }
  return out;
}
