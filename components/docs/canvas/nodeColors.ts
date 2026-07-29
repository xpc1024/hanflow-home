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
