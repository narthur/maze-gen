import "./style.css";
import { Cell, Position, Solver, Trail } from "./types";

type State = {
  grid: Cell[][];
  current: Position | null;
  stack: Position[];
  cellSize: number;
  cols: number;
  rows: number;
  phase: 'generating' | 'solving';
  solvers: [Solver, Solver];
  trails: [Trail[], Trail[]];
};

function getInitialState(): State {
  const canvas = document.querySelector<HTMLCanvasElement>("#maze-canvas")!;
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
    trails: [[], []]
  };
}

function updateState(prevState: State): State {
  if (prevState.phase === 'generating') {
    // Maze generation logic here
    return prevState;
  } else {
    // Solving logic here
    return prevState;
  }
}

function renderState(state: State) {
  const canvas = document.querySelector<HTMLCanvasElement>("#maze-canvas")!;
  const ctx = canvas.getContext("2d")!;
  
  // Clear canvas
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  // ... rest of rendering logic
}

// Initialize
let state = getInitialState();

function step() {
  state = updateState(state);
  renderState(state);
  requestAnimationFrame(step);
}
