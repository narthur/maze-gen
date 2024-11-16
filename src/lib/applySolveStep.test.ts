import { describe, it, expect } from 'vitest';
import { applySolveStep } from './applySolveStep';
import type { State } from '../types';

describe('applySolveStep', () => {
  it('should add each position to trails', () => {
    const initialState: State = {
      grid: [[{ visited: true, walls: { top: false, right: false, bottom: false, left: false } }]],
      current: null,
      stack: [],
      cellSize: 20,
      cols: 1,
      rows: 1,
      phase: 'solving',
      solvers: [
        { row: 0, col: 0, color: "rgba(0,0,0,0)" },
        { row: 0, col: 0, color: "rgba(0,0,0,0)" }
      ],
      trails: [[], []]
    };

    const result = applySolveStep(initialState);
    expect(result.trails[0].length).toBe(1);
    expect(result.trails[1].length).toBe(1);
  });
});
