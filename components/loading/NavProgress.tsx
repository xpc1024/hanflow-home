'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Click-instant route feedback. loading.tsx only mounts once the RSC payload
// starts streaming, so the click-to-TTFB gap (the multi-second "frozen page"
// window on slow links) needs its own signal: a capture-phase click listener
// shows the bar the moment an internal link is pressed, and the pathname
// change on commit retracts it. The bar therefore spans the whole navigation,
// including the skeleton phase rendered by loading.tsx.
const SHOW_DELAY_MS = 120;
const HIDE_TIMEOUT_MS = 8000;

export function NavProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function onPointerClick(e: MouseEvent) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/')) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same-page links (logo on home, hash jumps) never change the pathname,
      // so showing the bar would strand it until the safety timeout.
      if (url.pathname === window.location.pathname && !url.search) return;

      // Delay slightly so instant prefetched navigations do not flash the bar.
      clearTimeout(showTimer.current);
      showTimer.current = setTimeout(() => {
        setVisible(true);
        // Navigation may never commit (network failure); do not strand the bar.
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setVisible(false), HIDE_TIMEOUT_MS);
      }, SHOW_DELAY_MS);
    }

    document.addEventListener('click', onPointerClick, true);
    return () => {
      document.removeEventListener('click', onPointerClick, true);
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    };
  }, []);

  // Navigation committed: cancel any pending show and retract the bar.
  useEffect(() => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
    setVisible(false);
  }, [pathname]);

  if (!visible) return null;
  return <div className="route-progress motion-reduce:hidden" aria-hidden />;
}
