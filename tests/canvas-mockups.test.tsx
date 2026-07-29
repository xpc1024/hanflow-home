import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CanvasNodeMockup } from '../components/docs/canvas/CanvasNodeMockup';
import { NodePaletteMockup } from '../components/docs/canvas/NodePaletteMockup';
import { CanvasMockup } from '../components/docs/canvas/CanvasMockup';
import { StudioMockup } from '../components/docs/canvas/StudioMockup';
import { NodeTableMockup } from '../components/docs/canvas/NodeTableMockup';

describe('CanvasNodeMockup', () => {
  it('renders type label and summary lines', () => {
    render(
      <CanvasNodeMockup type="LLM" title="draft_llm" summary={['model: gpt-4o', 'role: assistant']} />,
    );
    expect(screen.getByText('LLM')).toBeInTheDocument();
    expect(screen.getByText('draft_llm')).toBeInTheDocument();
    expect(screen.getByText('model: gpt-4o')).toBeInTheDocument();
  });

  it('shows disabled marker when disabled', () => {
    render(<CanvasNodeMockup type="Tool" disabled />);
    expect(screen.getByText('disabled')).toBeInTheDocument();
  });
});

describe('NodePaletteMockup', () => {
  it('lists all 13 nodes grouped under 5 labels', () => {
    render(<NodePaletteMockup />);
    for (const label of ['CONTROL', 'LEAF', 'DYNAMIC', 'STATE', 'RETRIEVAL']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    for (const t of ['Sequential', 'LLM', 'Coordinator', 'Memory', 'Knowledge']) {
      expect(screen.getAllByText(t).length).toBeGreaterThan(0);
    }
  });

  it('highlights the given node', () => {
    const { container } = render(<NodePaletteMockup highlight="LLM" />);
    // highlighted item uses accent-glow background
    const glow = container.querySelector('[style*="accent-glow"]');
    expect(glow).not.toBeNull();
  });
});

describe('CanvasMockup', () => {
  it('renders all sample nodes in rich workflow', () => {
    render(<CanvasMockup workflow="rich" />);
    expect(screen.getByText('router')).toBeInTheDocument();
    expect(screen.getByText('approve')).toBeInTheDocument();
    expect(screen.getAllByText(/draft_llm/).length).toBeGreaterThan(0);
  });

  it('shows empty-state hint for empty workflow', () => {
    render(<CanvasMockup workflow="empty" />);
    expect(screen.getByText(/Drag a node/i)).toBeInTheDocument();
  });
});

describe('StudioMockup', () => {
  it('composes topbar + palette + canvas + inspector', () => {
    const { container } = render(<StudioMockup />);
    expect(container.querySelector('.not-prose')).not.toBeNull();
    expect(screen.getByText('support-router')).toBeInTheDocument(); // TopBar workflow name
    expect(screen.getByText('CONTROL')).toBeInTheDocument();        // Palette
    expect(screen.getByText('router')).toBeInTheDocument();         // Canvas node
    expect(screen.getByText('model')).toBeInTheDocument();          // Inspector field label
  });
});

describe('NodeTableMockup', () => {
  it('control group lists 5 nodes with color bars', () => {
    const { container } = render(<NodeTableMockup group="control" locale="en" />);
    expect(screen.getByText('Sequential')).toBeInTheDocument();
    expect(screen.getByText('HITL')).toBeInTheDocument();
    expect(container.querySelectorAll('code').length).toBeGreaterThanOrEqual(5);
  });

  it('zh locale shows Chinese headers', () => {
    render(<NodeTableMockup group="leaf" locale="zh" />);
    expect(screen.getByText('节点')).toBeInTheDocument();
    expect(screen.getByText('行为')).toBeInTheDocument();
  });
});
