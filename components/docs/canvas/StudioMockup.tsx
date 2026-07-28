import type { CSSProperties } from 'react';
import { TopBarMockup } from './TopBarMockup';
import { NodePaletteMockup } from './NodePaletteMockup';
import { CanvasMockup } from './CanvasMockup';
import { InspectorMockup } from './InspectorMockup';

interface Props { workflow?: 'rich' | 'empty' }

export function StudioMockup({ workflow = 'rich' }: Props) {
  const outer: CSSProperties = {
    borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden',
    background: 'var(--bg-base)',
  };
  const body: CSSProperties = { display: 'flex', height: 420, overflow: 'hidden' };
  return (
    <div className="not-prose" aria-hidden style={outer}>
      <TopBarMockup />
      <div style={body}>
        <NodePaletteMockup />
        <CanvasMockup workflow={workflow} />
        {workflow === 'rich' && <InspectorMockup type="LLM" />}
      </div>
    </div>
  );
}
