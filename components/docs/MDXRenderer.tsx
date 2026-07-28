import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export function MDXRenderer({ source, locale }: { source: string; locale?: string }) {
  // Theme-aware prose: colors bind to the CSS variable tokens (design-taste
  // 8.A token strategy + 4.11 Page Theme Lock), so body text follows the
  // active light/dark scheme instead of being locked to prose-invert's dark
  // palette (which rendered light-on-light in light mode).
  //
  // 自定义 <a> 组件: 把 MDX 正文里的 /docs/... 链接自动加 locale 前缀,
  // 避免跨语言跳转 (如 zh 页面点链接跳到 en)。仅处理站内文档链接,
  // 外链 (http/https/mailto) 保持原样。
  const components: Record<string, React.ComponentType<any>> = {};
  if (locale) {
    components.a = ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isInternalDocs =
        typeof href === 'string' && href.startsWith('/docs/') && !href.startsWith(`/${locale}/`);
      const finalHref = isInternalDocs ? `/${locale}${href}` : href;
      return (
        <a href={finalHref} {...rest}>
          {children}
        </a>
      );
    };
  }

  return (
    <div
      className="prose max-w-none prose-headings:scroll-mt-24 prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-li:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] prose-a:text-accent prose-th:text-[var(--text-primary)] prose-td:text-[var(--text-secondary)] prose-blockquote:border-accent prose-blockquote:text-[var(--text-secondary)] prose-hr:border-edge prose-pre:rounded-code prose-pre:border prose-pre:border-edge prose-pre:bg-bg-subtle prose-code:before:hidden prose-code:after:hidden prose-code:text-accent"
      style={{
        // CSS-variable theming for prose elements that lack a Tailwind
        // modifier. These override @tailwindcss/typography's hardcoded
        // zinc values so the doc content tracks the page theme tokens.
        ['--tw-prose-body' as string]: 'var(--text-secondary)',
        ['--tw-prose-headings' as string]: 'var(--text-primary)',
        ['--tw-prose-links' as string]: 'var(--accent)',
        ['--tw-prose-bold' as string]: 'var(--text-primary)',
        ['--tw-prose-counters' as string]: 'var(--text-muted)',
        ['--tw-prose-bullets' as string]: 'var(--text-muted)',
        ['--tw-prose-hr' as string]: 'var(--border)',
        ['--tw-prose-quotes' as string]: 'var(--text-secondary)',
        ['--tw-prose-quote-borders' as string]: 'var(--accent)',
        ['--tw-prose-captions' as string]: 'var(--text-muted)',
        ['--tw-prose-code' as string]: 'var(--accent)',
        ['--tw-prose-pre-bg' as string]: 'var(--bg-subtle)',
        ['--tw-prose-pre-code' as string]: 'var(--text-secondary)',
        ['--tw-prose-th-borders' as string]: 'var(--border)',
        ['--tw-prose-td-borders' as string]: 'var(--border)',
      }}
    >
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeShiki, { themes: { dark: 'github-dark', light: 'github-light' } }],
            ],
          },
        }}
      />
    </div>
  );
}
