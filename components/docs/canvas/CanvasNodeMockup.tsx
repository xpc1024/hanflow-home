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
