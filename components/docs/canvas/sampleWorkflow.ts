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
