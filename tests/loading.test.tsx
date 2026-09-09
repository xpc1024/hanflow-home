import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { DocsSkeleton } from '../components/loading/DocsSkeleton';
import { PageSkeleton } from '../components/loading/PageSkeleton';
import { NavProgress } from '../components/loading/NavProgress';
import { SkeletonStatus } from '../components/loading/SkeletonStatus';

const messages = { loading: { status: 'Loading' } };

function renderWithI18n(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('NavProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.pushState({}, '', '/zh/docs/quick-start');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function bar() {
    return document.querySelector('.route-progress');
  }

  // Synthetic anchors stand in for next/link, which also preventDefault so the
  // browser does not perform a full page navigation.
  function appendLink(href: string) {
    const a = document.createElement('a');
    a.href = href;
    a.addEventListener('click', (e) => e.preventDefault());
    document.body.appendChild(a);
    return a;
  }

  it('renders nothing until a navigation starts', () => {
    render(<NavProgress />);
    expect(bar()).toBeNull();
  });

  it('shows the bar shortly after an internal link click', () => {
    render(<NavProgress />);
    const a = appendLink('/zh/docs/core-concepts/dsl-syntax');

    act(() => {
      fireEvent.click(a);
    });
    expect(bar()).toBeNull(); // not yet: delayed to avoid flashes on instant navs

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(bar()).not.toBeNull();
    a.remove();
  });

  it('ignores external and same-page links', () => {
    render(<NavProgress />);
    const external = appendLink('https://github.com/xpc1024/hanflow');
    const samePage = appendLink('/zh/docs/quick-start');

    act(() => {
      fireEvent.click(external);
      fireEvent.click(samePage);
      vi.advanceTimersByTime(500);
    });
    expect(bar()).toBeNull();
    external.remove();
    samePage.remove();
  });

  it('retracts the bar via the safety timeout if navigation never commits', () => {
    render(<NavProgress />);
    const a = appendLink('/zh/docs/web-studio/build-mode');

    act(() => {
      fireEvent.click(a);
      vi.advanceTimersByTime(150);
    });
    expect(bar()).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(bar()).toBeNull();
    a.remove();
  });
});

describe('SkeletonStatus', () => {
  it('exposes an sr-only localized status message', () => {
    renderWithI18n(<SkeletonStatus />);
    expect(document.querySelector('.sr-only')?.textContent).toBe('Loading');
  });
});

describe('DocsSkeleton', () => {
  it('marks the region as busy and announces loading', () => {
    renderWithI18n(<DocsSkeleton />);
    const region = screen_getStatus();
    expect(region).toHaveAttribute('aria-busy', 'true');
  });

  it('mirrors the DocsShell three-column layout', () => {
    const { container } = renderWithI18n(<DocsSkeleton />);
    const asides = container.querySelectorAll('aside');
    expect(asides).toHaveLength(2);

    const sidebar = asides[0];
    expect(sidebar).toHaveClass('w-60');
    // One accent-tinted row echoes the real active sidebar item.
    expect(sidebar.querySelector('.bg-accent\\/25')).not.toBeNull();

    const toc = asides[1];
    expect(toc).toHaveClass('w-48');

    // Code-block placeholder keeps the docs radius system.
    expect(container.querySelector('.rounded-code')).not.toBeNull();
  });
});

describe('PageSkeleton', () => {
  it('marks the region as busy and announces loading', () => {
    renderWithI18n(<PageSkeleton />);
    expect(screen_getStatus()).toHaveAttribute('aria-busy', 'true');
  });
});

function screen_getStatus() {
  const regions = document.querySelectorAll('[role="status"]');
  if (regions.length !== 1) throw new Error('expected exactly one status region');
  return regions[0];
}
