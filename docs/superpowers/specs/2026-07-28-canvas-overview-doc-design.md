# 画布总览文档设计 (Canvas Overview Doc)

- **日期**: 2026-07-28
- **项目**: hanflow-home（Hanflow 官网）
- **目标**: 在官网文档新增一篇「画布总览」导览页，用**非图片、近乎复刻**的静态 UI 呈现 Hanflow Web Studio 的画布，让用户一眼看懂画布结构、节点、连线，并自然过渡到现有的 Build/Monitor/HITL 模式文档与「13 个原子节点」概念文档。
- **范围**: 仅 `1.2.0` 版本，zh + en 双语。

---

## 1. 背景与现状

### 1.1 官网栈
- Next.js 14 + next-intl + MDX（`next-mdx-remote/rsc`）+ Tailwind + Shiki。
- 设计 token 用 CSS 变量（dark-first）：`--bg-base #09090b`(zinc-950) / `--bg-elevated #18181b` / `--bg-subtle #27272a` / `--text-primary #fafafa` / `--text-secondary #a1a1aa` / `--text-muted #71717a` / `--accent #06b6d4`(cyan-500)（浅色模式另有覆盖）。
- 圆角 `card:16px` / `code:8px`；字体 Geist（sans/mono）；56px 网格纹理 `.bg-grid`；accent 径向辉光 `.accent-glow`。
- `MDXRenderer.tsx` 用 `MDXRemote` 渲染，支持 `components` 注入（目前只注入了 `<a>` 做 locale 前缀）。

### 1.2 文档结构
- 路径约定：`content/<version>/<locale>/<group>/<file>.mdx`。
- MDX **无 frontmatter**，页面标题来自正文一级 H1。
- 侧边栏导航在 `lib/docs.ts` 的 `GROUP_ORDER` 中按分组 + files 配置；标题按 locale 本地化；文件按文件系统存在性过滤。
- `web-studio` 分组现有：`build-mode`、`monitor-mode`、`hitl-approvals`（纯文本说明，无视觉呈现）。
- `core-concepts` 分组有 `nodes`（13 个原子节点），用三张 Markdown 表格讲节点 DSL config/语义。

### 1.3 产品画布（hanflow/web，复刻参照）
- `StudioShell` = `TopBar` + `NodePalette`(240px) + `WorkflowCanvas`(ReactFlow) + `InspectorPanel`(360px)。
- `CanvasNode`：宽 180px，8px 圆角，顶部 4px 类型色条，标题行（类型名 + hover actions），`NodeBody` 摘要，左右 `Handle`。
- 13 节点类型色与分组（来源 `web/lib/dsl/nodeMeta.ts`）：
  - control（灰 #6b7280）：Sequential / Parallel / Loop / Branch
  - control（黄 #eab308）：HITL
  - leaf（蓝 #3b82f6）：LLM
  - leaf（绿 #22c55e）：Tool
  - leaf（靛 #6366f1）：Research
  - leaf（橙 #f97316）：Execution
  - dynamic（紫 #a855f7）：Coordinator
  - state（天蓝 #0ea5e9）：Memory / Subworkflow
  - retrieval（青 #14b8a6）：Knowledge
- `WorkflowCanvas`：ReactFlow + 点状背景（gap 16）+ Controls + MiniMap；边为 2px 直线（`--text-secondary`）。
- 产品 token（`web/styles/tokens.css`）与官网 token **不同**（产品偏冷灰 + 蓝 accent）。

---

## 2. 设计决策（已与用户确认）

| # | 决策点 | 结论 |
|---|--------|------|
| D1 | 文档定位 | 新增一篇「画布总览」导览页，放 `web-studio` 分组最前；现有三篇保留。 |
| D2 | 复刻策略 | 忠于**官网 token**（zinc 黑 + cyan accent + Geist + 16/8 圆角）；**节点类型语义色保留产品色**（13 节点色快照）。 |
| D3 | 实现技术 | 方案 A：自定义 React 组件 + MDX 引用。100% 可 Vercel 部署，零新依赖。 |
| D4 | 组件拆分 | 拆成子组件家族（StudioMockup 组合 TopBar/Palette/Canvas/Node/Inspector）。 |
| D5 | 示例工作流 | 一个覆盖 control/leaf/dynamic/state/retrieval 多分组的丰富示例。 |
| D6 | 语言/版本 | 中英文都做；仅 `1.2.0`。 |
| D7 | 叙事结构 | 方案 A「分区解剖式」：完整全景 + 逐区特写 + 三模式入口。 |
| D8 | 与「13 节点」整合 | 方案 A 完整版：双向链接 + `<NodeTableMockup/>` 共享色映射。 |
| D9 | prose 隔离 | 所有 mockup 根元素 `not-prose` 整块隔离，组件内部自控全部样式。 |
| D10 | mockup 文案语言 | mockup 内 UI 文案一律**英文**（复刻产品真实界面：Save/Run/CONTROL/model:...）；文档正文讲解文字随 locale 双语。 |

---

## 3. 页面信息架构

新增文件：
- `content/1.2.0/zh/web-studio/canvas-overview.mdx`
- `content/1.2.0/en/web-studio/canvas-overview.mdx`

侧边栏标题：`画布总览` / `Canvas Overview`。

正文结构（按节）：

| # | 小节 | 内容 | 静态组件 |
|---|------|------|----------|
| 1 | 开场导语 | 一句话定位画布 + 完整 Studio 全景图 | `<StudioMockup />` |
| 2 | 画布的四个区域 | 总览 TopBar/Palette/Canvas/Inspector 职责，每区配特写 | `<TopBarMockup/>` `<NodePaletteMockup/>` `<CanvasMockup/>` `<InspectorMockup/>` |
| 3 | 节点：编排的原子 | 13 节点按 5 分组着色；Palette 特写 + 单节点解剖图 | `<NodePaletteMockup/>` `<NodeAnatomy/>` |
| 4 | 连线与 DAG | 拖拽连线、DAG 约束；Canvas 特写（示例工作流 + 连线） | `<CanvasMockup workflow="rich"/>` |
| 5 | 三种工作模式 | Build/Monitor/HITL 卡片，链到现有三篇 | 三张纯 Tailwind 卡片（非画布组件） |
| 6 | 节点语义导流 | 末尾导流到「13 个原子节点」概念页 | 文字 + 链接 |

侧边栏位置：插在 `web-studio` 分组 `files` 数组**最前**（build-mode 之前）。

frontmatter：沿用约定，**无 frontmatter**，标题来自一级 H1。

---

## 4. StudioMockup 组件家族

新建目录 `components/docs/canvas/`。所有组件**纯静态、无交互**，用官网 Tailwind 类 + CSS 变量渲染，节点语义色用常量映射。

### 4.1 组件树
```
<StudioMockup>                 # 完整全景（hero 用）
  <TopBarMockup/>
  <div flex>
    <NodePaletteMockup/>
    <CanvasMockup/>            # 内含多个 <CanvasNodeMockup/> + 连线 SVG
    <InspectorMockup/>
  </div>
</StudioMockup>
```

### 4.2 组件职责与 props

| 组件 | 职责 | 关键 props |
|------|------|-----------|
| `StudioMockup` | 组合全景，固定比例容器，overflow 隐藏，`aria-hidden` | `workflow?: "rich" \| "empty"` 默认 rich |
| `TopBarMockup` | 还原 TopBar：工作流名 + dirty 星标 + Save/Dry-run/Run + 节点计数 | 无（纯静态） |
| `NodePaletteMockup` | 左侧面板：搜索框 + 5 分组 + 13 节点（每项左侧 4px 类型色条） | `highlight?: NodeType` |
| `CanvasMockup` | 画布：点状背景 + 示例节点 + 连线 SVG + 右下 MiniMap 角标 | `workflow?: "rich" \| "empty"` |
| `CanvasNodeMockup` | 单节点：4px 色条 + 类型标题 + 正文摘要 + 左右 Handle 圆点 | `nodeType`, `title?`, `selected?`, `disabled?` |
| `NodeAnatomy` | 单节点解剖图（带标注引线，指向色条/标题/Handle） | `nodeType` |
| `InspectorMockup` | 右侧配置面板：节点标题 + 类型化表单字段示例 | `nodeType?` |
| `NodeTableMockup` | 节点表（用于概念页）：色条 + 名称 + 配置 + 行为 | `group: "control"\|"leaf"\|"dynamic"`（概念页语义分组，见 §5.2） |

### 4.3 共享数据文件

**`nodeColors.ts`**（13 节点色 + 分组快照）
- 从 `web/lib/dsl/nodeMeta.ts` **复制**（不跨包引用，保持官网独立构建）。
- 包含：13 节点的 `color` 与 `group`。
- **漂移风险（已知折中）**：产品将来加第 14 种节点，本文件不会自动同步。文件顶部注释必须标注同步来源路径：`// 同步来源：hanflow/web/lib/dsl/nodeMeta.ts`。

**`sampleWorkflow.ts`**（示例工作流）
- 覆盖 4 个分组、有分支的代表性工作流：
  ```
  Coordinator ──┬─► Branch ──┬─► LLM ──────────────► HITL ──► (end)
     (dynamic)  │  (control) │   (leaf)             (control)
                │            └─► Tool + Knowledge ──┘
                │                 (leaf)  (retrieval)
                └─► Memory (state，旁路)
  ```
- 节点类型覆盖：dynamic(Coordinator)、control(Branch/HITL)、leaf(LLM/Tool)、retrieval(Knowledge)、state(Memory) —— 跨全部 5 分组中的 5 个。
- 每节点带 `title`（如 `router`、`draft_llm`）和 `summary`（1-2 行，复刻 `getNodeSummary` 输出形态）。
- `position` 用**相对网格坐标**（如 `{x:0,y:1}`），由 CanvasMockup 内部映射到像素（避免硬编码像素；连线坐标由小组件根据两端节点坐标计算）。
- `selected` 默认指向 `draft_llm`（让 InspectorMockup 有内容）。

### 4.4 视觉规格（忠于官网 token）
- 容器圆角 `rounded-card`(16px)，边框 `border border-edge`。
- 画布底色 `bg-bg-elevated` + 点状背景（复刻产品点状 grid，但用官网 `--bg-subtle` 色点）。
- 节点：`w-[180px] rounded-code`(8px) `bg-bg-elevated` `border`，顶部 4px 类型色条。
- 文字用 `--text-primary/secondary/muted`，按钮 accent 用 cyan。
- 字体 Geist（官网已配置）。

### 4.5 响应式
- 全景 `StudioMockup` 在小屏（<md）等比缩放（`aspect-[16/9]` + 内部 `scale`），不破版。
- 逐区特写组件走正常文档流宽度，移动端天然可用。

---

## 5. 与「13 个原子节点」文档的整合

### 5.1 新增组件
`<NodeTableMockup group="control|leaf|dynamic|retrieval" />`
- 复用 `nodeColors.ts`，渲染节点表：每行 = [类型色条] + 节点名 + 关键配置 + 行为。
- `group` prop 控制渲染哪个分组，对应 `nodes.mdx` 现有的三张表（控制 / 叶子 / 动态与状态）。
- `not-prose` 隔离。

### 5.2 `nodes.mdx` 改动（zh + en）
1. **顶部反向导流**：「这些节点在画布上的视觉呈现见 [画布总览](/docs/web-studio/canvas-overview)」。
2. **三张 Markdown 表格 → 组件**（保持概念页原有的三段式语义分组）：
   - `<NodeTableMockup group="control"/>`（Sequential/Parallel/Loop/Branch/HITL）
   - `<NodeTableMockup group="leaf"/>`（LLM/Tool/Research/Execution）
   - `<NodeTableMockup group="dynamic"/>`（Coordinator/Memory/Subworkflow/Knowledge）
   - **分组映射规则（重要）**：`NodeTableMockup` 的 `group` prop 取的是**概念页的语义分组**（control/leaf/dynamic 三段），与产品 palette 的 5 分组（control/leaf/dynamic/state/retrieval）**不同**。具体：产品的 `state` 分组（Memory/Subworkflow）和 `retrieval` 分组（Knowledge）在概念页都并入「动态与状态」一段，故概念页用 `group="dynamic"` 渲染这 4 个节点。`nodeDocs.ts` 需维护「概念页语义分组」字段，与 `nodeColors.ts` 的「palette 分组」并存（两套分组，用途不同，互不覆盖）。
3. **数据来源**：表格的 config/行为文案从现有 mdx 文本抽取，搬进 `nodeDocs.ts`（节点 config/行为文案，含「概念页语义分组」字段，支持 locale）。
   - 设计原则：**组件管结构 + 色条，文案由数据文件提供**。

### 5.3 画布总览页改动（第 3 节 + 第 6 节）
- 第 3 节：`<NodePaletteMockup/>` 展示画布节点面板（色条 + 名称视觉索引）。
- 第 6 节：末尾导流「13 种节点的配置字段与语义 → [13 个原子节点](/docs/core-concepts/nodes)」。

### 5.4 共享语义（单一真相源）
- `nodeColors.ts`（色 + 分组）+ `nodeDocs.ts`（config/行为文案）被两个文档共用。任何一处改色/改文案，两边同步。

---

## 6. MDX 渲染接入 + 导航

### 6.1 `MDXRenderer.tsx` 改动（唯一需改的渲染器）
- 在 `components` 对象增加 8 个映射：StudioMockup / TopBarMockup / NodePaletteMockup / CanvasMockup / CanvasNodeMockup / NodeAnatomy / InspectorMockup / NodeTableMockup。
- **结构调整**：现有 `components` 只在 `if (locale)` 分支内构造。需调整为**始终构造**（画布组件无需 locale），再把 `<a>` 的 locale 处理叠加进去。

### 6.2 MDX 正文调用约定（硬约束）
- ✅ 允许：`<StudioMockup />`、`<CanvasMockup workflow="rich" />`、`<NodePaletteMockup highlight="LLM" />`、`<NodeTableMockup group="control" />` —— 无参或字面量 props。
- ❌ 禁止：在 MDX 传对象/数组 props。数据全在组件内部从 `sampleWorkflow.ts` / `nodeDocs.ts` 读取。
- 理由：`next-mdx-remote/rsc` 在 MDX 正文传复杂 props 语法不可靠。

### 6.3 `lib/docs.ts` 导航
`web-studio` 分组 `files` 数组最前插入：
```ts
{ file: 'web-studio/canvas-overview', title: { en: 'Canvas Overview', zh: '画布总览' } },
```

---

## 7. 实现约束（必须遵守）

1. **跨包隔离**：官网不 import 产品代码。节点色/分组/文档文案全部以快照形式存于 `components/docs/canvas/`，文件顶部注释标注同步来源。漂移风险为已知折中。
2. **图标**：复刻用 `lucide-react`（官网已装 0.469.0）。**已核实复刻所需图标在 0.469.0 均可用**：`Save`/`Play`/`Wand2`/`Palette`/`Search`/`Plus`/`Copy`/`Trash2`（lucide 文件名为 kebab-case 如 `wand-2.js`，React 导出为 PascalCase `Wand2`）。不新增依赖。
3. **MDX props 限制**：组件不接收对象/数组 props（见 6.2）。
4. **prose 隔离**：每个 mockup 根元素加 `not-prose`，组件内部全部样式自控，不依赖 prose 默认值。已核实：MDXRenderer 把自定义组件渲染在 `<div className="prose">` DOM 子树内，故 `@tailwindcss/typography` 的 `not-prose` 对 mockup 子树生效。mockup 内部一律用全局 token（`--text-primary` 等），不引用 prose 容器上的 `--tw-prose-*` 变量，二者命名空间不冲突，隔离安全。
5. **连线可维护性**：节点 position 用相对网格坐标；连线 path 由小组件根据两端节点坐标计算，不手算硬编码。
6. **a11y**：所有 mockup 根元素 `aria-hidden="true"`（纯装饰性示意图，避免读屏干扰）。
7. **不动**：`tailwind.config.ts`、`globals.css`（全用现有 token）、`1.0.1`/`1.1.0` 版本目录。

---

## 8. 文件清单

| 操作 | 文件 |
|------|------|
| 新建 | `components/docs/canvas/nodeColors.ts` |
| 新建 | `components/docs/canvas/nodeDocs.ts` |
| 新建 | `components/docs/canvas/sampleWorkflow.ts` |
| 新建 | `components/docs/canvas/StudioMockup.tsx` |
| 新建 | `components/docs/canvas/TopBarMockup.tsx` |
| 新建 | `components/docs/canvas/NodePaletteMockup.tsx` |
| 新建 | `components/docs/canvas/CanvasMockup.tsx` |
| 新建 | `components/docs/canvas/CanvasNodeMockup.tsx` |
| 新建 | `components/docs/canvas/NodeAnatomy.tsx` |
| 新建 | `components/docs/canvas/InspectorMockup.tsx` |
| 新建 | `components/docs/canvas/NodeTableMockup.tsx` |
| 新建 | `content/1.2.0/zh/web-studio/canvas-overview.mdx` |
| 新建 | `content/1.2.0/en/web-studio/canvas-overview.mdx` |
| 修改 | `components/docs/MDXRenderer.tsx`（注入 8 组件 + 调整 components 构造） |
| 修改 | `lib/docs.ts`（web-studio 分组最前加 canvas-overview） |
| 修改 | `content/1.2.0/zh/core-concepts/nodes.mdx`（反向链接 + 换表格组件） |
| 修改 | `content/1.2.0/en/core-concepts/nodes.mdx`（同上） |

---

## 9. 验证标准

- `npm run build` 通过（Vercel 部署前置）。
- `npm run typecheck` 通过。
- 本地 `npm run dev`：
  - `/zh/docs/web-studio/canvas-overview` 与 `/en/docs/web-studio/canvas-overview` 渲染正确。
  - 侧边栏 web-studio 分组最前出现「画布总览 / Canvas Overview」。
  - 画布 mockup 不被 prose 样式破坏（节点尺寸、TopBar 高度、色条正确）。
  - `/zh/docs/core-concepts/nodes` 与 `/en/docs/core-concepts/nodes` 的节点表带色条，顶部有反向链接。
  - 双向链接跳转正确（locale 不串）。
- 移动端：全景 StudioMockup 等比缩放不破版。
- a11y：读屏跳过 mockup 装饰区。
