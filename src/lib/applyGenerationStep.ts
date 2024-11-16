import type { State, Cell } from "../types";

export function applyGenerationStep(prevState: State): State {
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
    const newGrid = prevState.grid.map((row: Cell[]) => [...row]);
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
}
