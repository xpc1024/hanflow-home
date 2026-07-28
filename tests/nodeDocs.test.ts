import { describe, it, expect } from 'vitest';
import { NODE_DOCS } from '../components/docs/canvas/nodeDocs';
import { NODE_COLORS, ALL_NODE_TYPES } from '../components/docs/canvas/nodeColors';

describe('nodeDocs data integrity', () => {
  it('covers all 13 node types', () => {
    for (const nt of ALL_NODE_TYPES) {
      expect(NODE_DOCS[nt], `missing doc for ${nt}`).toBeDefined();
    }
    expect(ALL_NODE_TYPES).toHaveLength(13);
    expect(Object.keys(NODE_DOCS)).toHaveLength(13);
  });

  it('every node has en + zh config and behavior', () => {
    for (const nt of ALL_NODE_TYPES) {
      const row = NODE_DOCS[nt];
      expect(row.en.config.length).toBeGreaterThan(0);
      expect(row.en.behavior.length).toBeGreaterThan(0);
      expect(row.zh.config.length).toBeGreaterThan(0);
      expect(row.zh.behavior.length).toBeGreaterThan(0);
    }
  });

  it('concept groups map to the three concept-page sections', () => {
    const control = ALL_NODE_TYPES.filter((nt) => NODE_DOCS[nt].conceptGroup === 'control');
    const leaf = ALL_NODE_TYPES.filter((nt) => NODE_DOCS[nt].conceptGroup === 'leaf');
    const dynamic = ALL_NODE_TYPES.filter((nt) => NODE_DOCS[nt].conceptGroup === 'dynamic');
    expect(control).toEqual(['Sequential', 'Parallel', 'Loop', 'Branch', 'HITL']);
    expect(leaf).toEqual(['LLM', 'Tool', 'Research', 'Execution']);
    expect(dynamic).toEqual(['Coordinator', 'Memory', 'Subworkflow', 'Knowledge']);
  });

  it('nodeColors covers the same 13 nodes', () => {
    expect(Object.keys(NODE_COLORS).sort()).toEqual(ALL_NODE_TYPES.slice().sort());
  });
});
