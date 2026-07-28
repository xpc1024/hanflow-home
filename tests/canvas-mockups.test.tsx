import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CanvasNodeMockup } from '../components/docs/canvas/CanvasNodeMockup';
import { NodePaletteMockup } from '../components/docs/canvas/NodePaletteMockup';
import { CanvasMockup } from '../components/docs/canvas/CanvasMockup';

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
