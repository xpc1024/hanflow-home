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
