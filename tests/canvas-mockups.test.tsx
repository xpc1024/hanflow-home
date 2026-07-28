import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CanvasNodeMockup } from '../components/docs/canvas/CanvasNodeMockup';

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
