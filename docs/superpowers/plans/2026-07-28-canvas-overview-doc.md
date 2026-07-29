# 画布总览文档 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Hanflow 官网文档新增一篇「画布总览」导览页，用纯静态 React 组件（非图片）近乎复刻 Web Studio 画布 UI，并与「13 个原子节点」概念页双向联动。

**Architecture:** 新建 `components/docs/canvas/` 组件家族（StudioMockup 组合 TopBar/Palette/Canvas/Node/Inspector），数据/色值用快照文件隔离（不跨包依赖产品代码）。通过 `MDXRenderer.tsx` 注入组件到 MDX，在新增的 `canvas-overview.mdx`（zh+en）和改造的 `nodes.mdx`（zh+en）中引用。所有 mockup 用官网 CSS 变量 token + `not-prose` 隔离，节点类型语义色保留产品色。

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS + @tailwindcss/typography, lucide-react 0.469.0, vitest + @testing-library/react。零新依赖。

**Spec:** `docs/superpowers/specs/2026-07-28-canvas-overview-doc-design.md`

---

## File Structure

### 新建（`components/docs/canvas/`）
| 文件 | 职责 |
|------|------|
| `nodeColors.ts` | 13 节点 color + palette group 快照（同步来源：hanflow/web/lib/dsl/nodeMeta.ts） |
| `nodeDocs.ts` | 节点 config/行为文案 + 概念页语义分组（control/leaf/dynamic），支持 locale |
| `sampleWorkflow.ts` | 示例工作流节点+边数据（CanvasMockup/InspectorMockup 共用） |
| `MockupPrimitive.tsx` | 共享原子：色条、Handle 圆点、点状背景 div（被各 mockup 复用） |
| `CanvasNodeMockup.tsx` | 单节点（4px 色条+标题+摘要+左右 Handle） |
| `NodePaletteMockup.tsx` | 左侧面板（搜索框+5 分组+13 节点色条） |
| `TopBarMockup.tsx` | 顶栏（工作流名+dirty+Save/Dry-run/Run+计数） |
| `InspectorMockup.tsx` | 右侧配置面板（节点标题+类型化字段示例） |
| `CanvasMockup.tsx` | 画布（点状背景+示例节点+连线 SVG+MiniMap 角标） |
| `StudioMockup.tsx` | 全景组合（上述全部） |
| `NodeAnatomy.tsx` | 单节点解剖图（标注引线） |
| `NodeTableMockup.tsx` | 概念页节点表（色条+名称+配置+行为） |
| `index.ts` | 统一导出，供 MDXRenderer 引用 |

### 新建（content）
| 文件 | 职责 |
|------|------|
| `content/1.2.0/zh/web-studio/canvas-overview.mdx` | 中文画布总览页 |
| `content/1.2.0/en/web-studio/canvas-overview.mdx` | 英文画布总览页 |

### 修改
| 文件 | 改动 |
|------|------|
| `components/docs/MDXRenderer.tsx` | 注入 8 组件 + 调整 components 构造为始终构造 |
| `lib/docs.ts` | web-studio 分组最前加 canvas-overview |
| `content/1.2.0/zh/core-concepts/nodes.mdx` | 顶部反向链接 + 三表换 NodeTableMockup |
| `content/1.2.0/en/core-concepts/nodes.mdx` | 同上 |

### 测试
| 文件 | 职责 |
|------|------|
| `tests/canvas-mockups.test.tsx` | mockup 组件渲染快照断言 |
| `tests/nodeDocs.test.ts` | nodeDocs 数据完整性（13 节点全覆盖、locale 双语） |

---

## Task 1: 节点色快照 `nodeColors.ts`

**Files:**
- Create: `components/docs/canvas/nodeColors.ts`

- [ ] **Step 1: 写文件**

```ts
// 同步来源：hanflow/web/lib/dsl/nodeMeta.ts (FALLBACK_NODE_META)
// 漂移风险（已知折中）：产品将来新增节点需手动同步本文件。
// 节点类型语义色保留产品原色，其余 UI 忠于官网 token。

export type NodeType =
  | 'Sequential' | 'Parallel' | 'Loop' | 'Branch' | 'HITL'
  | 'LLM' | 'Tool' | 'Research' | 'Execution'
  | 'Coordinator' | 'Memory' | 'Subworkflow' | 'Knowledge';

// palette 分组（用于 NodePaletteMockup，复刻产品 NodePalette 的 5 分组）
export type PaletteGroup = 'control' | 'leaf' | 'dynamic' | 'state' | 'retrieval';

export interface NodeColorMeta {
  color: string;
  group: PaletteGroup;
}

export const NODE_COLORS: Record<NodeType, NodeColorMeta> = {
  Sequential: { color: '#6b7280', group: 'control' },
  Parallel:   { color: '#6b7280', group: 'control' },
  Loop:       { color: '#6b7280', group: 'control' },
  Branch:     { color: '#6b7280', group: 'control' },
  HITL:       { color: '#eab308', group: 'control' },
  LLM:        { color: '#3b82f6', group: 'leaf' },
  Tool:       { color: '#22c55e', group: 'leaf' },
  Research:   { color: '#6366f1', group: 'leaf' },
  Execution:  { color: '#f97316', group: 'leaf' },
  Coordinator:{ color: '#a855f7', group: 'dynamic' },
  Memory:     { color: '#0ea5e9', group: 'state' },
  Subworkflow:{ color: '#0ea5e9', group: 'state' },
  Knowledge:  { color: '#14b8a6', group: 'retrieval' },
};

export const ALL_NODE_TYPES = Object.keys(NODE_COLORS) as NodeType[];

export const PALETTE_GROUP_ORDER: PaletteGroup[] = ['control', 'leaf', 'dynamic', 'state', 'retrieval'];
```

- [ ] **Step 2: typecheck**

Run: `npm run typecheck`
Expected: PASS（新文件无引用，不影响现有编译）

- [ ] **Step 3: Commit**

```bash
git add components/docs/canvas/nodeColors.ts
git commit -m "feat(docs): add nodeColors snapshot for canvas mockups"
```

---

## Task 2: 节点文档数据 `nodeDocs.ts`

**Files:**
- Create: `components/docs/canvas/nodeDocs.ts`

- [ ] **Step 1: 写文件**（数据从 `content/1.2.0/{zh,en}/core-concepts/nodes.mdx` 抽取，搬入数据文件作为单一真相源）

```ts
// 节点文档文案的单一真相源。从 content/1.2.0/{zh,en}/core-concepts/nodes.mdx 抽取。
// conceptGroup = 概念页语义分组（control/leaf/dynamic），与 nodeColors 的 palette group 不同。
import type { NodeType } from './nodeColors';

export type ConceptGroup = 'control' | 'leaf' | 'dynamic';
export type Locale = 'en' | 'zh';

export interface NodeDocRow {
  config: string;
  behavior: string;
}

type LocalizedRow = Record<Locale, NodeDocRow>;

// 13 节点：config/behavior 双语 + 概念页语义分组。
// 概念页分三段：Control / Leaf / Dynamic and state（含 Memory/Subworkflow/Knowledge）。
export const NODE_DOCS: Record<NodeType, LocalizedRow & { conceptGroup: ConceptGroup }> = {
  Sequential: {
    conceptGroup: 'control',
    en: { config: '(structural)', behavior: 'Wiring node for ordered chains' },
    zh: { config: '（结构）', behavior: '顺序链的连接节点' },
  },
  Parallel: {
    conceptGroup: 'control',
    en: { config: 'join (all / any / first_n), n', behavior: 'Fan-out then join' },
    zh: { config: 'join（all / any / first_n）、n', behavior: '扇出后合并' },
  },
  Loop: {
    conceptGroup: 'control',
    en: { config: 'max_iterations (1-1000), condition, body', behavior: 'Iterate a sub-graph' },
    zh: { config: 'max_iterations（1-1000）、condition、body', behavior: '迭代子图' },
  },
  Branch: {
    conceptGroup: 'control',
    en: { config: 'cases (map), default', behavior: 'Route by expression' },
    zh: { config: 'cases（映射）、default', behavior: '按表达式分流' },
  },
  HITL: {
    conceptGroup: 'control',
    en: { config: 'actions (approve / edit / reject / reroute), timeout_seconds', behavior: 'Pause for a human' },
    zh: { config: 'actions（approve / edit / reject / reroute）、timeout_seconds', behavior: '暂停等人' },
  },
  LLM: {
    conceptGroup: 'leaf',
    en: { config: 'template or prompt, model, role', behavior: 'Call a model' },
    zh: { config: 'template 或 prompt、model、role', behavior: '调用模型' },
  },
  Tool: {
    conceptGroup: 'leaf',
    en: { config: 'tool (server.tool), args', behavior: 'Call an MCP tool' },
    zh: { config: 'tool（server.tool）、args', behavior: '调用 MCP 工具' },
  },
  Research: {
    conceptGroup: 'leaf',
    en: { config: 'query, depth (quick / standard / deep), max_sources', behavior: 'Gather sources' },
    zh: { config: 'query、depth（quick / standard / deep）、max_sources', behavior: '搜集来源' },
  },
  Execution: {
    conceptGroup: 'leaf',
    en: { config: 'task, sandbox (docker / firecracker / none), max_steps', behavior: 'Run an agent task' },
    zh: { config: 'task、sandbox（docker / firecracker / none）、max_steps', behavior: '执行 agent 任务' },
  },
  Coordinator: {
    conceptGroup: 'dynamic',
    en: { config: 'sub_agents, planning_model, plan_hitl, max_iterations', behavior: 'Plan and delegate' },
    zh: { config: 'sub_agents、planning_model、plan_hitl、max_iterations', behavior: '规划与委派' },
  },
  Memory: {
    conceptGroup: 'dynamic',
    en: { config: 'action (read / write / update / delete / summarize), key', behavior: 'Manage memory' },
    zh: { config: 'action（read / write / update / delete / summarize）、key', behavior: '管理记忆' },
  },
  Subworkflow: {
    conceptGroup: 'dynamic',
    en: { config: 'ref, inputs, version, timeout_seconds', behavior: 'Call another workflow' },
    zh: { config: 'ref、inputs、version、timeout_seconds', behavior: '调用另一工作流' },
  },
  Knowledge: {
    conceptGroup: 'dynamic',
    en: { config: 'store, query, top_k, rerank, min_score', behavior: 'Retrieve from a store' },
    zh: { config: 'store、query、top_k、rerank、min_score', behavior: '从 store 检索' },
  },
};
```

- [ ] **Step 2: typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/docs/canvas/nodeDocs.ts
git commit -m "feat(docs): add nodeDocs data source for node tables"
```

---

## Task 3: nodeDocs 数据完整性测试

**Files:**
- Create: `tests/nodeDocs.test.ts`

- [ ] **Step 1: 写失败测试**

```ts
import { describe, it, expect } from 'vitest';
import { NODE_DOCS } from '../components/docs/canvas/nodeDocs';
import { NODE_COLORS, ALL_NODE_TYPES } from '../components/docs/canvas/nodeColors';

describe('nodeDocs data integrity', () => {
  it('covers all 13 node types', () => {
    for (const nt of ALL_NODE_TYPES) {
      expect(NODE_DOCS[nt], `missing doc for ${nt}`).toBeDefined();
    }
    expect(ALL_NODE_TYPES).toHaveLength(13);
    expect(Object.keys(NODE_DOCS)).toHaveLength(13);
  });

  it('every node has en + zh config and behavior', () => {
    for (const nt of ALL_NODE_TYPES) {
      const row = NODE_DOCS[nt];
      expect(row.en.config.length).toBeGreaterThan(0);
      expect(row.en.behavior.length).toBeGreaterThan(0);
      expect(row.zh.config.length).toBeGreaterThan(0);
      expect(row.zh.behavior.length).toBeGreaterThan(0);
    }
  });

  it('concept groups map to the three concept-page sections', () => {
    const control = ALL_NODE_TYPES.filter((nt) => NODE_DOCS[nt].conceptGroup === 'control');
    const leaf = ALL_NODE_TYPES.filter((nt) => NODE_DOCS[nt].conceptGroup === 'leaf');
    const dynamic = ALL_NODE_TYPES.filter((nt) => NODE_DOCS[nt].conceptGroup === 'dynamic');
    expect(control).toEqual(['Sequential', 'Parallel', 'Loop', 'Branch', 'HITL']);
    expect(leaf).toEqual(['LLM', 'Tool', 'Research', 'Execution']);
    expect(dynamic).toEqual(['Coordinator', 'Memory', 'Subworkflow', 'Knowledge']);
  });

  it('nodeColors covers the same 13 nodes', () => {
    expect(Object.keys(NODE_COLORS).sort()).toEqual(ALL_NODE_TYPES.slice().sort());
  });
});
```

- [ ] **Step 2: 运行测试验证通过**（数据已在 Task 1/2 写好，应直接通过）

Run: `npx vitest run tests/nodeDocs.test.ts`
Expected: PASS（4 tests）

- [ ] **Step 3: Commit**

```bash
git add tests/nodeDocs.test.ts
git commit -m "test(docs): assert nodeDocs covers all 13 nodes bilingually"
```

---

## Task 4: 示例工作流数据 `sampleWorkflow.ts`

**Files:**
- Create: `components/docs/canvas/sampleWorkflow.ts`

- [ ] **Step 1: 写文件**（summary 文本格式对齐产品 `getNodeSummary` 的输出形态；position 用相对网格坐标，CanvasMockup 内部映射像素）

```ts
import type { NodeType } from './nodeColors';

// 示例工作流：覆盖 dynamic/control/leaf/retrieval/state 五个 palette 分组。
// 唯一数据源，CanvasMockup 与 InspectorMockup 共用。
// position 用相对网格坐标（列 x、行 y），由 CanvasMockup 映射为像素，避免硬编码。

export interface SampleNode {
  id: string;
  type: NodeType;
  title: string;
  summary: string[];   // 对齐产品 getNodeSummary().lines 形态
  position: { x: number; y: number };
  disabled?: boolean;
}

export interface SampleEdge {
  source: string;
  target: string;
}

export const SELECTED_NODE_ID = 'draft_llm';

export const SAMPLE_NODES: SampleNode[] = [
  {
    id: 'router', type: 'Coordinator', title: 'router',
    summary: ['Agents: planner, researcher', 'Iter: 5 | replan: on'],
    position: { x: 0, y: 1 },
  },
  {
    id: 'branch', type: 'Branch', title: 'branch',
    summary: ['2 cases + default'],
    position: { x: 1, y: 1 },
  },
  {
    id: 'draft_llm', type: 'LLM', title: 'draft_llm',
    summary: ['Draft a reply for {{input.msg}}', 'model: gpt-4o'],
    position: { x: 2, y: 0 },
  },
  {
    id: 'lookup', type: 'Tool', title: 'lookup',
    summary: ['kb.search', '2 args'],
    position: { x: 2, y: 2 },
  },
  {
    id: 'knowledge', type: 'Knowledge', title: 'knowledge',
    summary: ['docs | "refund policy"', 'top_k: 5'],
    position: { x: 3, y: 2 },
  },
  {
    id: 'approve', type: 'HITL', title: 'approve',
    summary: ['Actions: approve, edit, reject', 'Timeout: 3600s'],
    position: { x: 4, y: 1 },
  },
  {
    id: 'memory', type: 'Memory', title: 'memory',
    summary: ['write | session.ctx'],
    position: { x: 0, y: 3 },
  },
];

export const SAMPLE_EDGES: SampleEdge[] = [
  { source: 'router', target: 'branch' },
  { source: 'router', target: 'memory' },
  { source: 'branch', target: 'draft_llm' },
  { source: 'branch', target: 'lookup' },
  { source: 'lookup', target: 'knowledge' },
  { source: 'draft_llm', target: 'approve' },
  { source: 'knowledge', target: 'approve' },
];

export const SAMPLE_WORKFLOW_NAME = 'support-router';
```

- [ ] **Step 2: typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/docs/canvas/sampleWorkflow.ts
git commit -m "feat(docs): add sample workflow data for canvas mockups"
```

---

## Task 5: 共享原子 `MockupPrimitive.tsx`

**Files:**
- Create: `components/docs/canvas/MockupPrimitive.tsx`

- [ ] **Step 1: 写文件**（色条、Handle 圆点、点状背景三个可复用原子；全部 `not-prose` 由调用方根元素承担，原子自身不加 prose 类）

```tsx
import type { CSSProperties } from 'react';

// 4px 类型色条（节点顶部）
export function ColorBar({ color }: { color: string }) {
  return <div style={{ height: 4, background: color, borderRadius: '8px 8px 0 0' }} aria-hidden />;
}

// 连接端口圆点（左右 Handle 的静态还原）
export function HandleDot({ side }: { side: 'left' | 'right' }) {
  const style: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [side]: -5,
    width: 10,
    height: 10,
    borderRadius: '50%',
    border: '2px solid var(--border-bright)',
    background: 'var(--bg-elevated)',
  };
  return <div style={style} aria-hidden />;
}

// 点状画布背景（复刻 ReactFlow BackgroundVariant.Dots，用官网 --bg-subtle 色点）
export function DotsBackground() {
  const style: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(var(--bg-subtle) 1px, transparent 1px)',
    backgroundSize: '16px 16px',
    opacity: 0.6,
  };
  return <div style={style} aria-hidden />;
}
```

- [ ] **Step 2: typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/docs/canvas/MockupPrimitive.tsx
git commit -m "feat(docs): add shared mockup primitives (ColorBar/Handle/Dots)"
```

---

## Task 6: `CanvasNodeMockup.tsx`

**Files:**
- Create: `components/docs/canvas/CanvasNodeMockup.tsx`

- [ ] **Step 1: 写文件**（还原产品 CanvasNode：180px 宽、8px 圆角、4px 色条、标题行、摘要、左右 Handle；纯静态无交互）

```tsx
import type { CSSProperties } from 'react';
import { NODE_COLORS, type NodeType } from './nodeColors';
import { ColorBar, HandleDot } from './MockupPrimitive';

interface Props {
  type: NodeType;
  title?: string;
  summary?: string[];
  selected?: boolean;
  disabled?: boolean;
}

export function CanvasNodeMockup({ type, title, summary = [], selected = false, disabled = false }: Props) {
  const color = NODE_COLORS[type].color;
  const style: CSSProperties = {
    width: 180,
    borderRadius: 8,
    background: 'var(--bg-elevated)',
    border: `2px solid ${selected ? color : 'var(--border)'}`,
    boxShadow: selected ? `0 0 0 3px ${color}4D` : 'none',
    opacity: disabled ? 0.6 : 1,
    position: 'relative',
  };
  return (
    <div style={style}>
      <HandleDot side="left" />
      <ColorBar color={color} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px' }}>
        <span style={{ fontSize: 11, color, fontWeight: 600 }}>{type}</span>
        {disabled && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>disabled</span>}
      </div>
      <div style={{ padding: '0 12px 8px', fontSize: 12, color: 'var(--text-secondary)' }}>
        {title && <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: 2 }}>{title}</div>}
        {summary.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line}</div>
        ))}
      </div>
      <HandleDot side="right" />
    </div>
  );
}
```

- [ ] **Step 2: typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/docs/canvas/CanvasNodeMockup.tsx
git commit -m "feat(docs): add CanvasNodeMockup static node"
```

---

## Task 7: mockup 组件渲染测试

**Files:**
- Create: `tests/canvas-mockups.test.tsx`

- [ ] **Step 1: 写测试**（断言关键 mockup 渲染结构；先测已存在的 CanvasNodeMockup，后续 Task 完成后补充其余）

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CanvasNodeMockup } from '../components/docs/canvas/CanvasNodeMockup';

describe('CanvasNodeMockup', () => {
  it('renders type label and summary lines', () => {
    render(
      <CanvasNodeMockup type="LLM" title="draft_llm" summary={['model: gpt-4o', 'role: assistant']} />,
    );
    expect(screen.getByText('LLM')).toBeInTheDocument();
    expect(screen.getByText('draft_llm')).toBeInTheDocument();
    expect(screen.getByText('model: gpt-4o')).toBeInTheDocument();
  });

  it('shows disabled marker when disabled', () => {
    render(<CanvasNodeMockup type="Tool" disabled />);
    expect(screen.getByText('disabled')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 运行测试验证通过**

Run: `npx vitest run tests/canvas-mockups.test.ts`
Expected: PASS（2 tests）

- [ ] **Step 3: Commit**

```bash
git add tests/canvas-mockups.test.ts
git commit -m "test(docs): assert CanvasNodeMockup renders structure"
```

---

## Task 8: `NodePaletteMockup.tsx`

**Files:**
- Create: `components/docs/canvas/NodePaletteMockup.tsx`

- [ ] **Step 1: 写文件**（还原产品 NodePalette：240px 宽、搜索框、5 分组、每项 4px 色条+类型名；highlight 高亮某节点）

```tsx
import type { CSSProperties } from 'react';
import { Search } from 'lucide-react';
import {
  NODE_COLORS, ALL_NODE_TYPES, PALETTE_GROUP_ORDER, type NodeType, type PaletteGroup,
} from './nodeColors';

const GROUP_LABEL: Record<PaletteGroup, string> = {
  control: 'CONTROL', leaf: 'LEAF', dynamic: 'DYNAMIC', state: 'STATE', retrieval: 'RETRIEVAL',
};

interface Props {
  highlight?: NodeType;
}

export function NodePaletteMockup({ highlight }: Props) {
  const root: CSSProperties = {
    width: 240, flexShrink: 0, padding: '12px 0', background: 'var(--bg-elevated)',
  };
  return (
    <div style={root}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '0 12px 12px' }}>
        <Search size={14} color="var(--text-muted)" />
        <div style={{
          flex: 1, border: '1px solid var(--border)', borderRadius: 6,
          padding: '4px 8px', fontSize: 13, color: 'var(--text-muted)',
        }}>Search nodes…</div>
      </div>
      {PALETTE_GROUP_ORDER.map((g) => {
        const items = ALL_NODE_TYPES.filter((t) => NODE_COLORS[t].group === g);
        if (items.length === 0) return null;
        return (
          <div key={g} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', padding: '4px 12px', letterSpacing: '0.05em' }}>
              {GROUP_LABEL[g]}
            </div>
            {items.map((t) => {
              const active = highlight === t;
              return (
                <div key={t} style={{
                  display: 'flex', gap: 8, alignItems: 'center', padding: '6px 12px',
                  fontSize: 13, color: active ? 'var(--accent)' : 'var(--text-primary)',
                  background: active ? 'var(--accent-glow)' : 'transparent',
                }}>
                  <div style={{ width: 4, height: 20, background: NODE_COLORS[t].color, borderRadius: 2 }} />
                  {t}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: 扩充测试**

在 `tests/canvas-mockups.test.tsx` 追加：

```tsx
import { NodePaletteMockup } from '../components/docs/canvas/NodePaletteMockup';

describe('NodePaletteMockup', () => {
  it('lists all 13 nodes grouped under 5 labels', () => {
    render(<NodePaletteMockup />);
    for (const label of ['CONTROL', 'LEAF', 'DYNAMIC', 'STATE', 'RETRIEVAL']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    for (const t of ['Sequential', 'LLM', 'Coordinator', 'Memory', 'Knowledge']) {
      expect(screen.getAllByText(t).length).toBeGreaterThan(0);
    }
  });

  it('highlights the given node', () => {
    const { container } = render(<NodePaletteMockup highlight="LLM" />);
    // highlighted item uses accent-glow background
    const glow = container.querySelector('[style*="accent-glow"]');
    expect(glow).not.toBeNull();
  });
});
```

- [ ] **Step 3: 运行测试**

Run: `npx vitest run tests/canvas-mockups.test.ts`
Expected: PASS（4 tests）

- [ ] **Step 4: Commit**

```bash
git add components/docs/canvas/NodePaletteMockup.tsx tests/canvas-mockups.test.tsx
git commit -m "feat(docs): add NodePaletteMockup with 5 groups + highlight"
```

---

## Task 9: `TopBarMockup.tsx`

**Files:**
- Create: `components/docs/canvas/TopBarMockup.tsx`

- [ ] **Step 1: 写文件**（还原产品 TopBar：工作流名+dirty 星标+Save/Dry-run/Run 按钮+节点计数；纯静态，按钮用 div 避免被读屏当可交互）

```tsx
import type { CSSProperties } from 'react';
import { Save, Wand2, Play, Palette } from 'lucide-react';
import { SAMPLE_NODES, SAMPLE_WORKFLOW_NAME } from './sampleWorkflow';

const toolBtn: CSSProperties = {
  display: 'flex', gap: 4, alignItems: 'center', padding: '6px 12px', borderRadius: 6,
  border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontSize: 12,
};
const activeBtn: CSSProperties = { ...toolBtn, background: 'var(--accent)', color: '#fff', border: 'none' };

export function TopBarMockup() {
  const row: CSSProperties = {
    height: 48, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px',
    borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)',
  };
  const count = SAMPLE_NODES.length;
  return (
    <div style={row}>
      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{SAMPLE_WORKFLOW_NAME}</span>
      <span style={{ color: 'var(--accent)', fontSize: 20 }}>*</span>
      <div style={{ flex: 1 }} />
      <div style={activeBtn}><Save size={14} /> Save</div>
      <span style={{ color: 'var(--status-success, #22c55e)', fontSize: 12 }}>{count} nodes</span>
      <div style={toolBtn}><Wand2 size={14} /> Dry-run</div>
      <div style={activeBtn}><Play size={14} /> Run</div>
      <div style={toolBtn}>Auto-align</div>
      <div style={toolBtn}><Palette size={14} /></div>
    </div>
  );
}
```

- [ ] **Step 2: typecheck + 运行全部测试**

Run: `npm run typecheck && npx vitest run`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/docs/canvas/TopBarMockup.tsx
git commit -m "feat(docs): add TopBarMockup static toolbar"
```

---

## Task 10: `InspectorMockup.tsx`

**Files:**
- Create: `components/docs/canvas/InspectorMockup.tsx`

- [ ] **Step 1: 写文件**（还原产品 InspectorPanel：360px 宽、节点标题、类型化表单字段示例；展示选中节点 draft_llm 的 LLM 字段）

```tsx
import type { CSSProperties } from 'react';
import { NODE_COLORS, type NodeType } from './nodeColors';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ padding: '6px 8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, color: 'var(--text-primary)', background: 'var(--bg-base)' }}>{value}</div>
    </div>
  );
}

// 选中节点的示例配置字段（静态展示类型化表单形态）。
const FIELDS: Record<NodeType, { label: string; value: string }[]> = {
  LLM: [
    { label: 'model', value: 'gpt-4o' },
    { label: 'role', value: 'assistant' },
    { label: 'template', value: 'Draft a reply for {{input.msg}}' },
  ],
  Tool: [{ label: 'tool', value: 'kb.search' }, { label: 'args', value: '{ query: "{{input}}" }' }],
  Research: [{ label: 'query', value: '{{plan.output}}' }, { label: 'depth', value: 'standard' }],
  Execution: [{ label: 'task', value: '{{input.goal}}' }, { label: 'sandbox', value: 'docker' }],
  Coordinator: [{ label: 'sub_agents', value: 'planner, researcher' }, { label: 'planning_model', value: 'gpt-4o' }],
  HITL: [{ label: 'actions', value: 'approve, edit, reject' }, { label: 'timeout_seconds', value: '3600' }],
  Memory: [{ label: 'action', value: 'write' }, { label: 'key', value: 'session.ctx' }],
  Subworkflow: [{ label: 'ref', value: 'classify' }, { label: 'inputs', value: '{}' }],
  Knowledge: [{ label: 'store', value: 'docs' }, { label: 'top_k', value: '5' }],
  Branch: [{ label: 'cases', value: '2 cases + default' }],
  Parallel: [{ label: 'join', value: 'all' }, { label: 'n', value: '3' }],
  Loop: [{ label: 'max_iterations', value: '5' }, { label: 'condition', value: '{{state.retry < 3}}' }],
  Sequential: [{ label: 'note', value: 'structural wiring node' }],
};

interface Props { type?: NodeType }

export function InspectorMockup({ type = 'LLM' }: Props) {
  const color = NODE_COLORS[type].color;
  const root: CSSProperties = {
    width: 360, flexShrink: 0, padding: 16, background: 'var(--bg-elevated)',
    borderLeft: '1px solid var(--border)', overflow: 'auto',
  };
  return (
    <div style={root}>
      <div style={{ height: 4, background: color, borderRadius: 2, marginBottom: 12 }} />
      <div style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 4 }}>{type}</div>
      <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, marginBottom: 16 }}>draft_llm</div>
      {FIELDS[type].map((f) => <Field key={f.label} label={f.label} value={f.value} />)}
    </div>
  );
}
```

- [ ] **Step 2: typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/docs/canvas/InspectorMockup.tsx
git commit -m "feat(docs): add InspectorMockup config panel"
```

---

## Task 11: `CanvasMockup.tsx`（含连线 SVG 计算）

**Files:**
- Create: `components/docs/canvas/CanvasMockup.tsx`

- [ ] **Step 1: 写文件**（点状背景 + 示例节点 + 连线 SVG（bezier，控制点取中点偏移）+ 右下 MiniMap 角标；position 网格坐标→像素映射）

```tsx
import type { CSSProperties } from 'react';
import {
  SAMPLE_NODES, SAMPLE_EDGES, SELECTED_NODE_ID,
} from './sampleWorkflow';
import { CanvasNodeMockup } from './CanvasNodeMockup';
import { DotsBackground } from './MockupPrimitive';

// 网格坐标 → 像素映射。列宽/行高 + 起点 padding。
const COL_W = 220;
const ROW_H = 130;
const PAD_X = 40;
const PAD_Y = 30;
const NODE_W = 180;

const pos = (gx: number, gy: number) => ({
  left: PAD_X + gx * COL_W,
  top: PAD_Y + gy * ROW_H,
});

// 两节点中心连线（左 Handle→右 Handle 的水平 bezier）。
function edgePath(s: { left: number; top: number }, t: { left: number; top: number }) {
  const x1 = s.left + NODE_W;
  const y1 = s.top + 30;          // 近似节点垂直中线
  const x2 = t.left;
  const y2 = t.top + 30;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

interface Props { workflow?: 'rich' | 'empty' }

export function CanvasMockup({ workflow = 'rich' }: Props) {
  if (workflow === 'empty') {
    return (
      <div style={{ position: 'relative', flex: 1, minHeight: 320, background: 'var(--bg-base)' }}>
        <DotsBackground />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          Drag a node from the palette to start
        </div>
      </div>
    );
  }

  const nodeById = new Map(SAMPLE_NODES.map((n) => [n.id, n]));
  const edges = SAMPLE_EDGES
    .map((e) => ({ e, s: nodeById.get(e.source), t: nodeById.get(e.target) }))
    .filter((x) => x.s && x.t) as { e: typeof SAMPLE_EDGES[number]; s: typeof SAMPLE_NODES[number]; t: typeof SAMPLE_NODES[number] };

  const root: CSSProperties = {
    position: 'relative', flex: 1, minHeight: 320, background: 'var(--bg-base)', overflow: 'hidden',
  };
  return (
    <div style={root}>
      <DotsBackground />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden>
        {edges.map(({ e, s, t }) => {
          const sp = pos(s.position.x, s.position.y);
          const tp = pos(t.position.x, t.position.y);
          return <path key={`${e.source}-${e.target}`} d={edgePath(sp, tp)} fill="none" stroke="var(--text-secondary)" strokeWidth={2} />;
        })}
      </svg>
      {SAMPLE_NODES.map((n) => {
        const p = pos(n.position.x, n.position.y);
        return (
          <div key={n.id} style={{ position: 'absolute', left: p.left, top: p.top }}>
            <CanvasNodeMockup type={n.type} title={n.title} summary={n.summary} selected={n.id === SELECTED_NODE_ID} disabled={n.disabled} />
          </div>
        );
      })}
      {/* MiniMap 角标（右下静态还原） */}
      <div aria-hidden style={{
        position: 'absolute', right: 12, bottom: 12, width: 120, height: 70,
        background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, opacity: 0.85,
      }}>
        <div style={{ position: 'absolute', left: '20%', top: '15%', width: 14, height: 8, background: '#6b7280' }} />
        <div style={{ position: 'absolute', left: '45%', top: '40%', width: 10, height: 6, background: '#3b82f6' }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 扩充测试**

在 `tests/canvas-mockups.test.tsx` 追加：

```tsx
import { CanvasMockup } from '../components/docs/canvas/CanvasMockup';

describe('CanvasMockup', () => {
  it('renders all sample nodes in rich workflow', () => {
    render(<CanvasMockup workflow="rich" />);
    expect(screen.getByText('router')).toBeInTheDocument();
    expect(screen.getByText('approve')).toBeInTheDocument();
    expect(screen.getAllByText(/draft_llm/).length).toBeGreaterThan(0);
  });

  it('shows empty-state hint for empty workflow', () => {
    render(<CanvasMockup workflow="empty" />);
    expect(screen.getByText(/Drag a node/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: 运行测试**

Run: `npx vitest run tests/canvas-mockups.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/docs/canvas/CanvasMockup.tsx tests/canvas-mockups.test.tsx
git commit -m "feat(docs): add CanvasMockup with computed bezier edges + minimap"
```

---

## Task 12: `StudioMockup.tsx` 全景组合

**Files:**
- Create: `components/docs/canvas/StudioMockup.tsx`

- [ ] **Step 1: 写文件**（组合 TopBar + Palette + Canvas + Inspector；16:9 容器、overflow hidden、aria-hidden、小屏 scale 缩放）

```tsx
import type { CSSProperties } from 'react';
import { TopBarMockup } from './TopBarMockup';
import { NodePaletteMockup } from './NodePaletteMockup';
import { CanvasMockup } from './CanvasMockup';
import { InspectorMockup } from './InspectorMockup';

interface Props { workflow?: 'rich' | 'empty' }

export function StudioMockup({ workflow = 'rich' }: Props) {
  const outer: CSSProperties = {
    borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden',
    background: 'var(--bg-base)',
  };
  const body: CSSProperties = { display: 'flex', height: 420, overflow: 'hidden' };
  return (
    <div className="not-prose" aria-hidden style={outer}>
      <TopBarMockup />
      <div style={body}>
        <NodePaletteMockup />
        <CanvasMockup workflow={workflow} />
        {workflow === 'rich' && <InspectorMockup type="LLM" />}
      </div>
    </div>
  );
}
```

注：小屏缩放在 `canvas-overview.mdx` 外层用 Tailwind 响应式包裹类处理（见 Task 16），组件本身保持固定比例以保证视觉准确。

- [ ] **Step 2: 扩充测试**

在 `tests/canvas-mockups.test.tsx` 追加：

```tsx
import { StudioMockup } from '../components/docs/canvas/StudioMockup';

describe('StudioMockup', () => {
  it('composes topbar + palette + canvas + inspector', () => {
    const { container } = render(<StudioMockup />);
    expect(container.querySelector('.not-prose')).not.toBeNull();
    expect(screen.getByText('support-router')).toBeInTheDocument(); // TopBar workflow name
    expect(screen.getByText('CONTROL')).toBeInTheDocument();        // Palette
    expect(screen.getByText('router')).toBeInTheDocument();         // Canvas node
    expect(screen.getByText('model')).toBeInTheDocument();          // Inspector field label
  });
});
```

- [ ] **Step 3: 运行测试**

Run: `npx vitest run tests/canvas-mockups.test.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add components/docs/canvas/StudioMockup.tsx tests/canvas-mockups.test.tsx
git commit -m "feat(docs): add StudioMockup full-layout composition"
```

---

## Task 13: `NodeAnatomy.tsx` 节点解剖图

**Files:**
- Create: `components/docs/canvas/NodeAnatomy.tsx`

- [ ] **Step 1: 写文件**（单节点 + 标注引线指向色条/标题/Handle；用于讲解节点结构）

```tsx
import type { CSSProperties } from 'react';
import { CanvasNodeMockup } from './CanvasNodeMockup';
import type { NodeType } from './nodeColors';

interface Props { type?: NodeType }

// 标注项：文字 + 引线方向
const ANNOTATIONS = [
  { text: 'type color bar', side: 'left', top: 6 },
  { text: 'node type', side: 'right', top: 40 },
  { text: 'config summary', side: 'left', top: 78 },
  { text: 'connection handle', side: 'right', top: 30 },
] as const;

export function NodeAnatomy({ type = 'LLM' }: Props) {
  const root: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 48, padding: '24px 16px', flexWrap: 'wrap',
  };
  const annoStyle = (side: string, top: number): CSSProperties => ({
    position: 'absolute', [side]: -160, top,
    fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap',
    display: 'flex', alignItems: 'center', gap: 6,
  });
  return (
    <div className="not-prose" aria-hidden style={{ position: 'relative', background: 'var(--bg-subtle)', borderRadius: 12, padding: 16 }}>
      <div style={root}>
        <div style={{ position: 'relative' }}>
          <CanvasNodeMockup type={type} title="example" summary={['model: gpt-4o', 'role: assistant']} selected />
          {ANNOTATIONS.map((a) => (
            <div key={a.text} style={annoStyle(a.side, a.top)}>
              {a.side === 'left' ? <>— {a.text}</> : <>{a.text} —</>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add components/docs/canvas/NodeAnatomy.tsx
git commit -m "feat(docs): add NodeAnatomy labeled diagram"
```

---

## Task 14: `NodeTableMockup.tsx` 概念页节点表

**Files:**
- Create: `components/docs/canvas/NodeTableMockup.tsx`

- [ ] **Step 1: 写文件**（复用 nodeColors + nodeDocs；按 conceptGroup 过滤；色条+名称+config+behavior；接收 locale）

```tsx
import type { CSSProperties } from 'react';
import { ALL_NODE_TYPES } from './nodeColors';
import { NODE_DOCS, type ConceptGroup, type Locale } from './nodeDocs';

interface Props {
  group: ConceptGroup;
  locale?: Locale;
}

export function NodeTableMockup({ group, locale = 'en' }: Props) {
  const rows = ALL_NODE_TYPES.filter((nt) => NODE_DOCS[nt].conceptGroup === group);
  const th: CSSProperties = {
    textAlign: 'left', padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)',
  };
  const td: CSSProperties = { padding: '10px 12px', fontSize: 13, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' };
  const head = locale === 'zh'
    ? ['节点', '关键配置', '行为']
    : ['Node', 'Key config', 'Behavior'];
  return (
    <div className="not-prose" style={{ overflowX: 'auto', margin: '16px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>{head.map((h) => <th key={h} style={th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((nt) => {
            const row = NODE_DOCS[nt][locale];
            return (
              <tr key={nt}>
                <td style={{ ...td, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div aria-hidden style={{ width: 4, height: 18, background: require('./nodeColors').NODE_COLORS[nt].color, borderRadius: 2 }} />
                  <code style={{ color: 'var(--accent)', fontSize: 13 }}>{nt}</code>
                </td>
                <td style={td}>{row.config}</td>
                <td style={td}>{row.behavior}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

注：上面用 `require` 取色仅为避免与已 import 的 `ALL_NODE_TYPES` 重复导入；实际实现改为在文件顶部直接 `import { ALL_NODE_TYPES, NODE_COLORS } from './nodeColors'` 并引用 `NODE_COLORS[nt].color`。实现者按此修正（见 Step 2）。

- [ ] **Step 2: 修正 import（去掉 require）**

将顶部 import 改为：
```tsx
import { ALL_NODE_TYPES, NODE_COLORS } from './nodeColors';
```
将色条 `background` 改为 `NODE_COLORS[nt].color`。

- [ ] **Step 3: 扩充测试**

在 `tests/canvas-mockups.test.tsx` 追加：

```tsx
import { NodeTableMockup } from '../components/docs/canvas/NodeTableMockup';

describe('NodeTableMockup', () => {
  it('control group lists 5 nodes with color bars', () => {
    const { container } = render(<NodeTableMockup group="control" locale="en" />);
    expect(screen.getByText('Sequential')).toBeInTheDocument();
    expect(screen.getByText('HITL')).toBeInTheDocument();
    expect(container.querySelectorAll('code').length).toBeGreaterThanOrEqual(5);
  });

  it('zh locale shows Chinese headers', () => {
    render(<NodeTableMockup group="leaf" locale="zh" />);
    expect(screen.getByText('节点')).toBeInTheDocument();
    expect(screen.getByText('行为')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: 运行测试**

Run: `npx vitest run tests/canvas-mockups.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/docs/canvas/NodeTableMockup.tsx tests/canvas-mockups.test.tsx
git commit -m "feat(docs): add NodeTableMockup colored node table"
```

---

## Task 15: `index.ts` 统一导出 + MDXRenderer 注入

**Files:**
- Create: `components/docs/canvas/index.ts`
- Modify: `components/docs/MDXRenderer.tsx`

- [ ] **Step 1: 写 index.ts**

```ts
export { StudioMockup } from './StudioMockup';
export { TopBarMockup } from './TopBarMockup';
export { NodePaletteMockup } from './NodePaletteMockup';
export { CanvasMockup } from './CanvasMockup';
export { CanvasNodeMockup } from './CanvasNodeMockup';
export { NodeAnatomy } from './NodeAnatomy';
export { InspectorMockup } from './InspectorMockup';
export { NodeTableMockup } from './NodeTableMockup';
```

- [ ] **Step 2: 修改 MDXRenderer.tsx**

把现有 `components` 的构造从「仅 `if (locale)` 内」改为「始终构造 + 叠加 locale `<a>`」。替换 `MDXRenderer` 函数体中 `const components ...` 到 `return (` 之间的部分：

现有代码（要替换的部分）：
```tsx
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
```

替换为：
```tsx
  const components: Record<string, React.ComponentType<any>> = {
    StudioMockup,
    TopBarMockup,
    NodePaletteMockup,
    CanvasMockup,
    CanvasNodeMockup,
    NodeAnatomy,
    InspectorMockup,
    NodeTableMockup,
  };
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
```

并在文件顶部 import 区追加：
```tsx
import {
  StudioMockup, TopBarMockup, NodePaletteMockup, CanvasMockup,
  CanvasNodeMockup, NodeAnatomy, InspectorMockup, NodeTableMockup,
} from '@/components/docs/canvas';
```

- [ ] **Step 3: typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 4: 运行全部测试（确保 MDXRenderer 注入未破坏现有 docs.test）**

Run: `npx vitest run`
Expected: PASS（所有测试）

- [ ] **Step 5: Commit**

```bash
git add components/docs/canvas/index.ts components/docs/MDXRenderer.tsx
git commit -m "feat(docs): inject canvas mockups into MDXRenderer"
```

---

## Task 16: 中文画布总览页 `canvas-overview.mdx`

**Files:**
- Create: `content/1.2.0/zh/web-studio/canvas-overview.mdx`

- [ ] **Step 1: 写文件**（正文中文；mockup 引用按约定只用无参/字面量 props；响应式外层包裹在小屏缩放）

```mdx
# 画布总览

画布是 Hanflow 的可视化编排核心。你从左侧面板拖出节点，在中间画布上连线组成
工作流（DAG），右侧面板配置每个节点。下面是一张完整的画布全景：

<StudioMockup />

## 画布的四个区域

画布由四个固定区域组成：

| 区域 | 职责 |
| --- | --- |
| TopBar（顶栏） | 工作流命名、保存、Dry-run、运行、主题切换 |
| NodePalette（节点面板） | 列出 13 种节点，按分组着色，拖拽到画布 |
| WorkflowCanvas（画布） | 节点与连线的编排区域，持久化位置 |
| InspectorPanel（配置面板） | 选中节点后，按其 schema 生成类型化表单 |

顶栏承载工作流的「全局动作」：命名、保存（带 dirty 守卫）、Dry-run（不调用真实模型即可观察执行形态）、运行：

<TopBarMockup />

## 节点：编排的原子

13 种节点按五个分组着色，颜色即语义：控制节点灰、叶子节点按类型上色、动态/状态/检索各有专属色。
节点面板按分组折叠展示：

<NodePaletteMockup />

每个节点是一个固定结构的卡片：顶部 4px 类型色条、类型名、配置摘要、左右两个连接端口（Handle）：

<NodeAnatomy />

## 连线与 DAG

从一个节点的右侧 Handle 拖到另一个节点的左侧 Handle 即建立一条边。所有边构成一个有向无环图
（DAG）——画布会阻止成环。下面是一个覆盖动态路由、分支、叶子、检索、审批的示例工作流：

<CanvasMockup workflow="rich" />

## 三种工作模式

画布在不同模式下呈现不同状态：

- **Build 模式**：编辑工作流，拖拽节点、连线、配置。详见 [Build 模式](/docs/web-studio/build-mode)。
- **Monitor 模式**：画布只读，实时观察一次运行（WebSocket 流式更新节点状态）。详见
  [Monitor 模式](/docs/web-studio/monitor-mode)。
- **HITL 审批**：工作流暂停在人审节点，等待 approve / edit / reject。详见
  [HITL 审批](/docs/web-studio/hitl-approvals)。

## 节点语义

画布只展示节点的「长相」。13 种节点的配置字段、JSON Schema 校验与 DSL 语义，见
[13 个原子节点](/docs/core-concepts/nodes)。
```

- [ ] **Step 2: Commit**

```bash
git add content/1.2.0/zh/web-studio/canvas-overview.mdx
git commit -m "docs: add zh canvas-overview page"
```

---

## Task 17: 英文画布总览页 `canvas-overview.mdx`

**Files:**
- Create: `content/1.2.0/en/web-studio/canvas-overview.mdx`

- [ ] **Step 1: 写文件**

```mdx
# Canvas Overview

The canvas is the visual orchestration core of Hanflow. You drag nodes from the
left palette, wire them into a directed acyclic graph (DAG) on the canvas, and
configure each node in the right inspector. Here is the full canvas at a glance:

<StudioMockup />

## The Four Regions

The canvas is composed of four fixed regions:

| Region | Responsibility |
| --- | --- |
| TopBar | Workflow naming, save, dry-run, run, theme toggle |
| NodePalette | Lists the 13 node types, color-coded by group, drag onto canvas |
| WorkflowCanvas | The editing surface for nodes and edges; positions are persisted |
| InspectorPanel | Typed form generated from the selected node's config schema |

The top bar carries the global actions — naming, save (with a dirty guard),
dry-run (observe execution shape without real model calls), and run:

<TopBarMockup />

## Nodes: The Atoms of Orchestration

The 13 node types are color-coded by five groups; color is semantics: control
nodes are gray, leaf nodes are tinted by type, and dynamic / state / retrieval
nodes each get a dedicated hue. The palette lists them grouped:

<NodePaletteMockup />

Each node is a fixed-structure card: a 4px type color bar on top, the type name,
a config summary, and two connection handles (left/right):

<NodeAnatomy />

## Edges and the DAG

Drag from a node's right handle to another's left handle to create an edge. All
edges form a directed acyclic graph (DAG) — the canvas prevents cycles. Below is
a sample workflow spanning dynamic routing, branching, leaves, retrieval, and
approval:

<CanvasMockup workflow="rich" />

## The Three Modes

The canvas renders differently in each mode:

- **Build mode**: edit the workflow — drag, wire, configure. See
  [Build Mode](/docs/web-studio/build-mode).
- **Monitor mode**: the canvas is read-only; observe a run in real time (node
  states stream over WebSocket). See [Monitor Mode](/docs/web-studio/monitor-mode).
- **HITL approvals**: the workflow pauses at a human-review node awaiting
  approve / edit / reject. See [HITL Approvals](/docs/web-studio/hitl-approvals).

## Node Semantics

The canvas only shows what nodes *look like*. For the config fields, JSON Schema
validation, and DSL semantics of the 13 node types, see
[13 Primitive Nodes](/docs/core-concepts/nodes).
```

- [ ] **Step 2: Commit**

```bash
git add content/1.2.0/en/web-studio/canvas-overview.mdx
git commit -m "docs: add en canvas-overview page"
```

---

## Task 18: 侧边栏导航 `lib/docs.ts`

**Files:**
- Modify: `lib/docs.ts`（web-studio 分组 files 数组最前插入）

- [ ] **Step 1: 修改**

在 `GROUP_ORDER` 的 `'web-studio'` 条目，`files` 数组最前加一项。现有：

```ts
  'web-studio': {
    title: { en: 'Web Studio', zh: 'Web Studio' },
    files: [
      { file: 'web-studio/build-mode', title: { en: 'Build Mode', zh: 'Build 模式' } },
```

改为：

```ts
  'web-studio': {
    title: { en: 'Web Studio', zh: 'Web Studio' },
    files: [
      { file: 'web-studio/canvas-overview', title: { en: 'Canvas Overview', zh: '画布总览' } },
      { file: 'web-studio/build-mode', title: { en: 'Build Mode', zh: 'Build 模式' } },
```

- [ ] **Step 2: typecheck + 运行 docs 测试**

Run: `npm run typecheck && npx vitest run tests/docs.test.ts`
Expected: PASS（fixture 中无 canvas-overview 文件，buildSidebarTree 自动过滤，不影响现有断言）

- [ ] **Step 3: Commit**

```bash
git add lib/docs.ts
git commit -m "feat(docs): add canvas-overview to web-studio sidebar nav"
```

---

## Task 19: 改造中文 `nodes.mdx`

**Files:**
- Modify: `content/1.2.0/zh/core-concepts/nodes.mdx`

- [ ] **Step 1: 重写文件**（顶部加反向链接；三张表换 NodeTableMockup；保留 Example 与尾注）

```mdx
# 13 个原子节点

工作流由 13 种节点组合而成。每个节点声明 `type`、`id`、`depends_on` 边列表，
以及一个按 JSON Schema 校验的 `config` 块。这些节点在画布上的视觉呈现见
[画布总览](/docs/web-studio/canvas-overview)。

## 控制节点

<NodeTableMockup group="control" locale="zh" />

## 叶子节点

<NodeTableMockup group="leaf" locale="zh" />

## 动态与状态节点

<NodeTableMockup group="dynamic" locale="zh" />

## 示例

```yaml
nodes:
  - id: plan
    type: LLM
    config: { role: planner, template: "Draft a plan for {{input.goal}}" }
  - id: search
    type: Research
    depends_on: [plan]
    config: { query: "{{plan.output}}", depth: standard }
  - id: approve
    type: HITL
    depends_on: [search]
    config: { actions: [approve, reject], timeout_seconds: 3600 }
```

每个节点还可设置 `condition`、`on_error`、`retry`、`timeout_seconds`、`sensitivity`、`disabled`。
```

注意：mdx 内嵌的 ```yaml 代码块需用三反引号 fence 正确闭合（实现时确保 fence 不与本 mdx 模板的 fence 冲突）。

- [ ] **Step 2: Commit**

```bash
git add content/1.2.0/zh/core-concepts/nodes.mdx
git commit -m "docs: wire zh nodes.mdx to NodeTableMockup + backlink"
```

---

## Task 20: 改造英文 `nodes.mdx`

**Files:**
- Modify: `content/1.2.0/en/core-concepts/nodes.mdx`

- [ ] **Step 1: 重写文件**

```mdx
# 13 Primitive Nodes

Workflows are composed from 13 node types. Each node declares a `type`, an `id`,
a `depends_on` edge list, and a `config` block validated against a JSON Schema.
For how these nodes appear on the canvas, see
[Canvas Overview](/docs/web-studio/canvas-overview).

## Control nodes

<NodeTableMockup group="control" locale="en" />

## Leaf nodes

<NodeTableMockup group="leaf" locale="en" />

## Dynamic and state nodes

<NodeTableMockup group="dynamic" locale="en" />

## Example

```yaml
nodes:
  - id: plan
    type: LLM
    config: { role: planner, template: "Draft a plan for {{input.goal}}" }
  - id: search
    type: Research
    depends_on: [plan]
    config: { query: "{{plan.output}}", depth: standard }
  - id: approve
    type: HITL
    depends_on: [search]
    config: { actions: [approve, reject], timeout_seconds: 3600 }
```

Every node also accepts `condition`, `on_error`, `retry`, `timeout_seconds`,
`sensitivity`, and `disabled`.
```

- [ ] **Step 2: Commit**

```bash
git add content/1.2.0/en/core-concepts/nodes.mdx
git commit -m "docs: wire en nodes.mdx to NodeTableMockup + backlink"
```

---

## Task 21: 全量验证

**Files:** 无（验证步骤）

- [ ] **Step 1: typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 2: lint**

Run: `npm run lint`
Expected: PASS（无 error；warning 视情处理）

- [ ] **Step 3: 全量测试**

Run: `npx vitest run`
Expected: PASS（含 nodeDocs / canvas-mockups / docs / CopyButton / versions 全部）

- [ ] **Step 4: 生产构建**

Run: `npm run build`
Expected: 构建成功（Vercel 部署前置）

- [ ] **Step 5: 本地 dev 人工核验**

Run: `npm run dev`

逐项核对：
1. 访问 `/zh/docs/web-studio/canvas-overview` —— 页面渲染，StudioMockup 全景 + 各特写正常，未被 prose 样式破坏。
2. 访问 `/en/docs/web-studio/canvas-overview` —— 同上，英文正文。
3. 侧边栏 web-studio 分组最前出现「画布总览 / Canvas Overview」。
4. 节点色条、连线、MiniMap 角标、Inspector 字段视觉正确。
5. 访问 `/zh/docs/core-concepts/nodes` 与 `/en/docs/core-concepts/nodes` —— 节点表带色条，顶部有反向链接到画布总览。
6. 双向链接跳转：画布总览→13 节点、13 节点→画布总览，locale 不串（zh 停留 zh）。
7. 缩窄浏览器至手机宽度：StudioMockup 容器内不破版（节点可能需横向滚动，可接受）。

- [ ] **Step 6: 最终 Commit（如有构建产物或修复）**

```bash
git add -A
git commit -m "chore(docs): verify canvas overview build + tests pass"
```

---

## Self-Review（plan 作者自查，已完成）

**1. Spec 覆盖**：
- §1 信息架构 → Task 16/17（canvas-overview.mdx 六节）✅
- §2 D2 忠于官网 token → 所有 mockup 用 CSS 变量 ✅
- §2 D3 React 组件 + MDX → Task 6-15 ✅
- §2 D4 子组件家族 → Task 6/8/9/10/11/12/13 ✅
- §2 D5 丰富示例工作流 → Task 4（7 节点 5 分组）✅
- §2 D6 zh+en / 1.2.0 → Task 16/17/19/20 ✅
- §2 D7 分区解剖 → Task 16/17 正文结构 ✅
- §2 D8 双向链接 + NodeTableMockup → Task 14/15/19/20 ✅
- §2 D9 not-prose → StudioMockup/NodeAnatomy/NodeTableMockup 根元素 ✅
- §2 D10 mockup 英文 → 所有 mockup 文案英文 ✅
- §7 七约束 → Task 1（跨包隔离注释）/Task 9（图标）/Task 15（MDX 注入）/not-prose/Task 11（连线计算）/aria-hidden/不动 tailwind ✅

**2. 占位符扫描**：无 TBD/TODO；Task 14 的 `require` 已在 Step 2 明确指示修正为标准 import。

**3. 类型一致性**：`NodeType` / `PaletteGroup` / `ConceptGroup` / `Locale` 跨文件命名一致；`SAMPLE_NODES`/`SAMPLE_EDGES`/`SELECTED_NODE_ID` 引用一致；`NODE_COLORS`/`NODE_DOCS` 键集合对齐（Task 3 测试已断言）。
