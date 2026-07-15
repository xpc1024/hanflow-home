'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Github, ExternalLink } from 'lucide-react';

const LINKS = [
  { key: 'sourceGithub', href: 'https://github.com/xpc1024/hanflow', Icon: Github },
  { key: 'sourceGitee', href: 'https://gitee.com/easy-es/hanflow', Icon: ExternalLink },
];

export function SourceDropdown() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-sm text-content-secondary hover:text-content-primary transition-colors"
        aria-expanded={open}
      >
        {t('source')}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-code border border-edge bg-bg-elevated p-1 shadow-xl">
          {LINKS.map(({ key, href, Icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-content-secondary hover:bg-bg-subtle hover:text-content-primary"
              onClick={() => setOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {t(key as 'sourceGithub')}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
