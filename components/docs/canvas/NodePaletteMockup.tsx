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
