import "./style.css";
import type { Cell, Position, Solver, Trail } from "./types";

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
    if (!prevState.current) return prevState;

    // Get unvisited neighbors
    const neighbors = [];
    const { row, col } = prevState.current;
    
    if (row > 0 && !prevState.grid[row - 1][col].visited)
      neighbors.push({ row: row - 1, col, dir: "top" });
    if (col < prevState.cols - 1 && !prevState.grid[row][col + 1].visited)
      neighbors.push({ row, col: col + 1, dir: "right" });
    if (row < prevState.rows - 1 && !prevState.grid[row + 1][col].visited)
      neighbors.push({ row: row + 1, col, dir: "bottom" });
    if (col > 0 && !prevState.grid[row][col - 1].visited)
      neighbors.push({ row, col: col - 1, dir: "left" });

    if (neighbors.length > 0) {
      // Choose random neighbor
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Create new grid with updated walls
      const newGrid = prevState.grid.map(row => [...row]);
      if (next.dir === "top") {
        newGrid[row][col].walls.top = false;
        newGrid[next.row][next.col].walls.bottom = false;
      } else if (next.dir === "right") {
        newGrid[row][col].walls.right = false;
        newGrid[next.row][next.col].walls.left = false;
      } else if (next.dir === "bottom") {
        newGrid[row][col].walls.bottom = false;
        newGrid[next.row][next.col].walls.top = false;
      } else if (next.dir === "left") {
        newGrid[row][col].walls.left = false;
        newGrid[next.row][next.col].walls.right = false;
      }
      newGrid[next.row][next.col].visited = true;

      return {
        ...prevState,
        grid: newGrid,
        current: next,
        stack: [...prevState.stack, prevState.current]
      };
    } else if (prevState.stack.length > 0) {
      return {
        ...prevState,
        current: prevState.stack[prevState.stack.length - 1],
        stack: prevState.stack.slice(0, -1)
      };
    } else {
      return {
        ...prevState,
        phase: 'solving'
      };
    }
  } else {
    // Solving logic here - will implement next
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
  ctx.strokeStyle = "#4a4a4a";
  state.grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      const x = j * state.cellSize;
      const y = i * state.cellSize;
      
      if (cell.walls.top) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + state.cellSize, y);
        ctx.stroke();
      }
      if (cell.walls.right) {
        ctx.beginPath();
        ctx.moveTo(x + state.cellSize, y);
        ctx.lineTo(x + state.cellSize, y + state.cellSize);
        ctx.stroke();
      }
      if (cell.walls.bottom) {
        ctx.beginPath();
        ctx.moveTo(x, y + state.cellSize);
        ctx.lineTo(x + state.cellSize, y + state.cellSize);
        ctx.stroke();
      }
      if (cell.walls.left) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + state.cellSize);
        ctx.stroke();
      }
    });
  });
}

// Initialize and start
let state = getInitialState();

function step() {
  state = updateState(state);
  renderState(state);
  requestAnimationFrame(step);
}

// Start animation
step();
