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
