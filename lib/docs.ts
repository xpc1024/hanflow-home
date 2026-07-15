import { existsSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface SidebarItem {
  title: string;
  slug: string;
}

export interface SidebarNode {
  title: string;
  items: SidebarItem[];
}

// Display order + group mapping for the docs sidebar (design spec 4).
// Titles are localized per-locale so the sidebar follows the language switch.
type LocaleTitle = { en: string; zh: string };
type LocalizedFile = { file: string; title: LocaleTitle };
type LocalizedGroup = { title: LocaleTitle; files: LocalizedFile[] };

const GROUP_ORDER: Record<string, LocalizedGroup> = {
  'getting-started': {
    title: { en: 'Getting Started', zh: '快速开始' },
    files: [
      { file: 'quick-start', title: { en: 'Quick Start', zh: '快速开始' } },
      { file: 'configuration', title: { en: 'Configuration', zh: '配置' } },
    ],
  },
  'core-concepts': {
    title: { en: 'Core Concepts', zh: '核心概念' },
    files: [
      { file: 'core-concepts/nodes', title: { en: '13 Primitive Nodes', zh: '13 个原子节点' } },
      { file: 'core-concepts/dsl-syntax', title: { en: 'DSL Syntax', zh: 'DSL 语法' } },
      { file: 'core-concepts/control-flow', title: { en: 'Control Flow', zh: '控制流' } },
      { file: 'core-concepts/model-routing', title: { en: 'Model Routing', zh: '模型路由' } },
      { file: 'core-concepts/mcp-tool-bus', title: { en: 'MCP Tool Bus', zh: 'MCP 工具总线' } },
      { file: 'core-concepts/rag-retrieval', title: { en: 'RAG Retrieval', zh: 'RAG 检索' } },
    ],
  },
  'web-studio': {
    title: { en: 'Web Studio', zh: 'Web Studio' },
    files: [
      { file: 'web-studio/build-mode', title: { en: 'Build Mode', zh: 'Build 模式' } },
      { file: 'web-studio/monitor-mode', title: { en: 'Monitor Mode', zh: 'Monitor 模式' } },
      { file: 'web-studio/hitl-approvals', title: { en: 'HITL Approvals', zh: 'HITL 审批' } },
    ],
  },
  'api-reference': {
    title: { en: 'API Reference', zh: 'API 参考' },
    files: [
      { file: 'api-reference/cli', title: { en: 'CLI Commands', zh: 'CLI 命令' } },
      { file: 'api-reference/rest', title: { en: 'REST Endpoints', zh: 'REST 端点' } },
      { file: 'api-reference/websocket', title: { en: 'WebSocket Events', zh: 'WebSocket 事件' } },
      { file: 'api-reference/webhooks', title: { en: 'Webhook Triggers', zh: 'Webhook 触发' } },
      { file: 'api-reference/error-codes', title: { en: 'Error Codes', zh: '错误码' } },
    ],
  },
};

const GROUP_KEYS = Object.keys(GROUP_ORDER);

/**
 * Build the ordered sidebar tree SYNCHRONOUSLY. Files are filtered against the
 * filesystem so missing docs do not appear in the nav, but ordering/titles are
 * deterministic. Uses existsSync (sync) so callers don't need to await.
 */
export function buildSidebarTree(
  root: string,
  version: string,
  locale: string,
): SidebarNode[] {
  const base = path.join(root, version, locale);
  const exists = (rel: string) => existsSync(path.join(base, `${rel}.mdx`));

  const out: SidebarNode[] = [];
  const lang: 'en' | 'zh' = locale === 'zh' ? 'zh' : 'en';
  for (const key of GROUP_KEYS) {
    const group = GROUP_ORDER[key];
    const items: SidebarItem[] = [];
    for (const f of group.files) {
      if (exists(f.file)) {
        items.push({ title: f.title[lang], slug: f.file });
      }
    }
    if (items.length > 0) out.push({ title: group.title[lang], items });
  }
  return out;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

/** Extract h2/h3 headings as a table of contents. */
export function parseToc(md: string): TocItem[] {
  const lines = md.split('\n');
  const toc: TocItem[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) {
      const depth = m[1].length;
      const text = m[2].replace(/[#*`]/g, '').trim();
      toc.push({ depth, text, slug: slugifyHeading(text) });
    }
  }
  return toc;
}

export interface DocSiblings {
  previous?: SidebarItem;
  next?: SidebarItem;
}

export function findDocSiblings(tree: SidebarNode[], slug: string): DocSiblings {
  const flat = tree.flatMap((g) => g.items);
  const idx = flat.findIndex((i) => i.slug === slug);
  if (idx === -1) return {};
  return {
    previous: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}

export interface DocFile {
  raw: string;
  toc: TocItem[];
}

/** Read a doc MDX by version/locale/slug. Returns null if missing. */
export async function readDoc(
  root: string,
  version: string,
  locale: string,
  rest: string[],
): Promise<DocFile | null> {
  const file = path.join(root, version, locale, `${rest.join('/')}.mdx`);
  try {
    const raw = await fs.readFile(file, 'utf8');
    return { raw, toc: parseToc(raw) };
  } catch {
    return null;
  }
}
