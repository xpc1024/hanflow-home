'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Check, ChevronDown } from 'lucide-react';
import { MAJOR_VERSIONS, LATEST_MAJOR, LATEST_SEMVER } from '@/lib/versions';

export function VersionSelector() {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 从当前路径解析 locale + 当前线 + rest。
  // 路径形如 /{locale}/docs/[<major>.x/]<slug...>
  function parsePath() {
    const segs = (pathname || '').split('/').filter(Boolean);
    const locale = segs[0] && ['en', 'zh'].includes(segs[0]) ? segs[0] : 'en';
    const docsIdx = segs.indexOf('docs');
    const afterDocs = docsIdx >= 0 ? segs.slice(docsIdx + 1) : [];
    let currentLine: string = LATEST_MAJOR;
    let rest: string[] = afterDocs;
    if (afterDocs.length > 0 && /^\d+\.x$/.test(afterDocs[0])) {
      currentLine = afterDocs[0];
      rest = afterDocs.slice(1);
    }
    return { locale, currentLine, rest };
  }

  const { locale, currentLine, rest } = parsePath();
  const current = MAJOR_VERSIONS.includes(currentLine as never) ? currentLine : LATEST_MAJOR;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function selectLine(target: string) {
    // 保留 locale; LATEST 线不加前缀, 其余加 <major>.x/
    const slugPart = rest.join('/');
    const prefix = target === LATEST_MAJOR ? '' : `${target}/`;
    const href = `/${locale}/docs/${prefix}${slugPart}`;
    window.localStorage.setItem('hanflow-docs-version', target);
    setOpen(false);
    router.push(href);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm text-content-secondary hover:text-content-primary transition-colors"
        aria-expanded={open}
      >
        {current}
        <span className="text-xs text-content-muted">({LATEST_SEMVER})</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-code border border-edge bg-bg-elevated p-1 shadow-xl">
          {MAJOR_VERSIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => selectLine(v)}
              className="flex w-full items-center justify-between rounded px-3 py-2 text-sm text-content-secondary hover:bg-bg-subtle hover:text-content-primary"
            >
              {v}
              {v === current && <Check className="h-3.5 w-3.5 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
