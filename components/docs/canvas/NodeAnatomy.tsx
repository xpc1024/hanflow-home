import type { CSSProperties } from 'react';
import { CanvasNodeMockup } from './CanvasNodeMockup';
import type { NodeType } from './nodeColors';

interface Props { type?: NodeType }

// 标注项：文字 + 引线方向
const ANNOTATIONS = [
  { text: 'type color bar', side: 'left', top: 6 },
  { text: 'node type', side: 'right', top: 40 },
  { text: 'config summary', side: 'left', top: 78 },
  { text: 'connection handle', side: 'right', top: 30 },
] as const;

export function NodeAnatomy({ type = 'LLM' }: Props) {
  const root: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 48, padding: '24px 16px', flexWrap: 'wrap',
  };
  const annoStyle = (side: string, top: number): CSSProperties => ({
    position: 'absolute', [side]: -160, top,
    fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap',
    display: 'flex', alignItems: 'center', gap: 6,
  });
  return (
    <div className="not-prose" aria-hidden style={{ position: 'relative', background: 'var(--bg-subtle)', borderRadius: 12, padding: 16 }}>
      <div style={root}>
        <div style={{ position: 'relative' }}>
          <CanvasNodeMockup type={type} title="example" summary={['model: gpt-4o', 'role: assistant']} selected />
          {ANNOTATIONS.map((a) => (
            <div key={a.text} style={annoStyle(a.side, a.top)}>
              {a.side === 'left' ? <>— {a.text}</> : <>{a.text} —</>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
