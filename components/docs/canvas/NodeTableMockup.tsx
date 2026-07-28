import type { CSSProperties } from 'react';
import { ALL_NODE_TYPES, NODE_COLORS } from './nodeColors';
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
                  <div aria-hidden style={{ width: 4, height: 18, background: NODE_COLORS[nt].color, borderRadius: 2 }} />
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
