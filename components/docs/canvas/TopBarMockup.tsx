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
