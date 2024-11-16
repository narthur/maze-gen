import type { State, Cell } from "../types";

export function renderState(state: State) {
  const canvas = document.querySelector<HTMLCanvasElement>("#maze-canvas")!;
  const ctx = canvas.getContext("2d")!;
  
  // Clear canvas
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = "#4a4a4a";
  state.grid.forEach((row: Cell[], i: number) => {
    row.forEach((cell: Cell, j: number) => {
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

  // Highlight current cell during generation
  if (state.phase === 'generating' && state.current) {
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(
      state.current.col * state.cellSize,
      state.current.row * state.cellSize,
      state.cellSize,
      state.cellSize
    );
  }

  // Draw trails (last 15 positions with decreasing opacity)
  const recentTrail1 = [...state.trails[0]].slice(-15).reverse();
  const recentTrail2 = [...state.trails[1]].slice(-15).reverse();

  recentTrail1.forEach((pos, idx) => {
    const opacity = 1 - idx / 15;
    ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
    ctx.fillRect(
      pos.col * state.cellSize + state.cellSize/4,
      pos.row * state.cellSize + state.cellSize/4,
      state.cellSize/2,
      state.cellSize/2
    );
  });

  recentTrail2.forEach((pos, idx) => {
    const opacity = 1 - idx / 15;
    ctx.fillStyle = `rgba(0, 0, 255, ${opacity})`;
    ctx.fillRect(
      pos.col * state.cellSize + state.cellSize/4,
      pos.row * state.cellSize + state.cellSize/4,
      state.cellSize/2,
      state.cellSize/2
    );
  });
}
