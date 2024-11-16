import type { State } from "../types";

export function getInitialState(): State {
  const canvas = document.querySelector<HTMLCanvasElement>("#maze-canvas")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const params = new URLSearchParams(window.location.search);
  const cellSize = Number(params.get('cellSize')) || 20;
  const cols = Math.floor(canvas.width / cellSize);
  const rows = Math.floor(canvas.height / cellSize);
  
  return {
    grid: Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true },
      }))
    ),
    current: { row: 0, col: 0 },
    stack: [],
    cellSize,
    cols,
    rows,
    phase: 'generating',
    solvers: [
      { row: rows - 1, col: cols - 1, color: "rgba(0,0,0,0)" },
      { row: rows - 1, col: cols - 1, color: "rgba(0,0,0,0)" }
    ],
    trails: [[], []],
    solved: false
  };
}
