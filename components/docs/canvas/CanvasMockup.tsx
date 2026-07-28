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
