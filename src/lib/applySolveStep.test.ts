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
        { row: 1, col: 1, color: "rgba(0,0,0,0)" }
      ],
      trails: [[], []],
      solved: false
    };

    applySolveStep(initialState); // Initialize marks
    const result = applySolveStep(initialState); // Check solved state
    expect(result.solved).toBe(true);
  });
});
