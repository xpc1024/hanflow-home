import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';
import { DocsPager } from './DocsPager';
import { Breadcrumb } from './Breadcrumb';
import { MDXRenderer } from './MDXRenderer';
import type { SidebarNode, TocItem, DocSiblings } from '@/lib/docs';
import type { Crumb } from './Breadcrumb';

export interface DocsShellProps {
  tree: SidebarNode[];
  toc: TocItem[];
  siblings: DocSiblings;
  activeSlug: string;
  locale: string;
  crumbs: Crumb[];
  source: string;
}

export function DocsShell(props: DocsShellProps) {
  const { tree, toc, siblings, activeSlug, locale, crumbs, source } = props;
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10">
      <aside className="hidden w-60 shrink-0 md:block">
        <Sidebar tree={tree} locale={locale} activeSlug={activeSlug} />
      </aside>
      <div className="min-w-0 flex-1">
        <Breadcrumb items={crumbs} />
        <article className="mt-6 max-w-3xl">
          <MDXRenderer source={source} locale={locale} />
          <DocsPager siblings={siblings} locale={locale} />
        </article>
      </div>
      <aside className="hidden w-48 shrink-0 lg:block">
        <TableOfContents items={toc} />
      </aside>
    </div>
  );
}
