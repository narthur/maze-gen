import { describe, it, expect } from 'vitest';
import { applySolveStep } from './applySolveStep';
import type { State } from '../types';

describe('applySolveStep', () => {
  it('should add each position to trails', () => {
    const initialState: State = {
      grid: [
        [{ visited: true, walls: { top: true, right: false, bottom: false, left: true } },
         { visited: true, walls: { top: true, right: true, bottom: false, left: false } }],
        [{ visited: true, walls: { top: false, right: false, bottom: true, left: true } },
         { visited: true, walls: { top: false, right: true, bottom: true, left: false } }]
      ],
      current: null,
      stack: [],
      cellSize: 20,
      cols: 2,
      rows: 2,
      phase: 'solving',
      solvers: [
        { row: 1, col: 1, color: "rgba(0,0,0,0)" },
        { row: 1, col: 1, color: "rgba(0,0,0,0)" }
      ],
      trails: [[], []],
      solved: false
    };

    const result = applySolveStep(initialState);
    expect(result.trails[0].length).toBe(1);
    expect(result.trails[1].length).toBe(1);
  });

  it('should set solved flag when solver reaches (0,0)', () => {
    const initialState: State = {
      grid: [
        [{ visited: true, walls: { top: true, right: false, bottom: false, left: true } },
         { visited: true, walls: { top: true, right: true, bottom: false, left: false } }],
        [{ visited: true, walls: { top: false, right: false, bottom: true, left: true } },
         { visited: true, walls: { top: false, right: true, bottom: true, left: false } }]
      ],
      current: null,
      stack: [],
      cellSize: 20,
      cols: 2,
      rows: 2,
      phase: 'solving',
      solvers: [
        { row: 0, col: 0, color: "rgba(0,0,0,0)" },
        { row: 0, col: 1, color: "rgba(0,0,0,0)" }  // Changed position to avoid stuck detection
      ],
      trails: [[], []],
      solved: false
    };

    const result = applySolveStep(initialState);
    expect(result.solved).toBe(true);
  });

  it('should detect when a solver has no valid moves', () => {
    // Simplified version of the actual stuck state focusing on the relevant section
    const stuckState: State = {
      grid: [
        [{ visited: true, walls: { top: true, right: true, bottom: true, left: true } }],
        [{ visited: true, walls: { top: true, right: true, bottom: true, left: true } }],
        [{ visited: true, walls: { top: true, right: true, bottom: true, left: true } }]
      ],
      current: null,
      stack: [],
      cellSize: 20,
      cols: 3,
      rows: 3,
      phase: 'solving',
      solvers: [
        { row: 1, col: 0, color: "rgba(0,0,0,0)" },
        { row: 2, col: 0, color: "rgba(0,0,0,0)" }
      ],
      trails: [[], []],
      solved: false
    };

    // First call should work
    applySolveStep(stuckState);
    
    // Should throw when solver has no valid moves
    expect(() => applySolveStep(stuckState)).toThrow('Solver 1 is stuck at the same position');
  });
});
