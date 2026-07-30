'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { SidebarNode } from '@/lib/docs';
import { LATEST_MAJOR } from '@/lib/versions';

export function Sidebar({
  tree,
  locale,
  activeSlug,
  version,
}: {
  tree: SidebarNode[];
  locale: string;
  activeSlug: string;
  version: string; // 大版本线, 如 '1.x'; LATEST_MAJOR 时无前缀
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function hrefFor(slug: string) {
    // LATEST 线不加前缀; 旧线加 <major>.x/ 前缀
    const prefix = version === LATEST_MAJOR ? '' : `${version}/`;
    return `/${locale}/docs/${prefix}${slug}`;
  }

  return (
    <nav className="space-y-6 text-sm">
      {tree.map((group) => {
        const isCollapsed = collapsed[group.title] ?? false;
        return (
          <div key={group.title}>
            <button
              type="button"
              onClick={() => setCollapsed((c) => ({ ...c, [group.title]: !isCollapsed }))}
              className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-content-muted"
            >
              {group.title}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
            </button>
            {!isCollapsed && (
              <ul className="mt-2 space-y-1 border-l border-edge">
                {group.items.map((item) => {
                  const active = item.slug === activeSlug;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={hrefFor(item.slug)}
                        className={`-ml-px block border-l-2 px-3 py-1.5 transition-colors ${
                          active
                            ? 'border-accent text-content-primary'
                            : 'border-transparent text-content-secondary hover:text-content-primary'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
