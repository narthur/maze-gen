import type { State } from "../types";

// Track visited entrances (marks) and previous positions for each solver
let marks1: { top: number; right: number; bottom: number; left: number }[][] | null = null;
let marks2: { top: number; right: number; bottom: number; left: number }[][] | null = null;
let prevPos1: { row: number; col: number } | null = null;
let prevPos2: { row: number; col: number } | null = null;

const directions = [
  { dir: "top", row: -1, col: 0, wall: "top" },
  { dir: "right", row: 0, col: 1, wall: "right" },
  { dir: "bottom", row: 1, col: 0, wall: "bottom" },
  { dir: "left", row: 0, col: -1, wall: "left" }
] as const;

function moveRunner(
  runner: { row: number; col: number; color: string },
  marks: { top: number; right: number; bottom: number; left: number }[][],
  state: State
) {
  const { row, col } = runner;
  const moves = [];

  for (const { dir, row: rowDelta, col: colDelta, wall } of directions) {
    const newRow = row + rowDelta;
    const newCol = col + colDelta;
    if (!state.grid[row][col].walls[wall as keyof (typeof state.grid)[0][0]["walls"]] &&
        newRow >= 0 && newRow < state.rows &&
        newCol >= 0 && newCol < state.cols) {
      // Following Trémaux's rules with randomness for equal choices
      const markCount = marks[row]?.[col]?.[dir as keyof (typeof marks)[0][0]] ?? 0;
      // Allow any valid move, but prefer less marked paths
      moves.push({ row: newRow, col: newCol, dir, markCount });
    }
  }

  if (moves.length > 0) {
    // First prefer unmarked paths, then single-marked paths, then double-marked if necessary
    // For paths with equal marks, choose randomly
    moves.sort(() => Math.random() - 0.5);
    moves.sort((a, b) => a.markCount - b.markCount);
    const move = moves[0];

    // Mark both sides of the passage
    if (marks[row]?.[col]) {
      marks[row][col][move.dir as keyof (typeof marks)[0][0]]++;
      const oppositeDir = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
      } as const;
      if (marks[move.row]?.[move.col]) {
        marks[move.row][move.col][oppositeDir[move.dir as keyof typeof oppositeDir]]++;
      }
    }

    runner.row = move.row;
    runner.col = move.col;
  }
}

export function applySolveStep(prevState: State): State {
  // Being in same position twice != being stuck
  // Only throw if there are no valid moves available
  const hasValidMoves = (solver: typeof prevState.solvers[0]) => {
    const { row, col } = solver;
    return directions.some(({ row: newRow, col: newCol, wall }) => 
      !prevState.grid[row][col].walls[wall as keyof (typeof prevState.grid)[0][0]["walls"]] &&
      newRow >= 0 && newRow < prevState.rows &&
      newCol >= 0 && newCol < prevState.cols
    );
  };

  if (prevPos1 && prevState.solvers[0].row === prevPos1.row && prevState.solvers[0].col === prevPos1.col && !hasValidMoves(prevState.solvers[0])) {
    console.error('Solver 1 stuck! Current state:', prevState);
    throw new Error('Solver 1 is stuck at the same position');
  }
  if (prevPos2 && prevState.solvers[1].row === prevPos2.row && prevState.solvers[1].col === prevPos2.col && !hasValidMoves(prevState.solvers[1])) {
    console.error('Solver 2 stuck! Current state:', prevState);
    throw new Error('Solver 2 is stuck at the same position');
  }

  // Initialize marks and reset previous positions if needed
  if (!marks1 || !marks2) {
    prevPos1 = null;
    prevPos2 = null;
    marks1 = Array(prevState.rows).fill(null).map(() =>
      Array(prevState.cols).fill(null).map(() => ({
        top: 0, right: 0, bottom: 0, left: 0
      })));
    marks2 = Array(prevState.rows).fill(null).map(() =>
      Array(prevState.cols).fill(null).map(() => ({
        top: 0, right: 0, bottom: 0, left: 0
      })));
  }

  // Store current positions before moving
  prevPos1 = { row: prevState.solvers[0].row, col: prevState.solvers[0].col };
  prevPos2 = { row: prevState.solvers[1].row, col: prevState.solvers[1].col };

  // Move runners
  moveRunner(prevState.solvers[0], marks1, prevState);
  moveRunner(prevState.solvers[1], marks2, prevState);

  const currentTime = Date.now();
  const newState = {
    ...prevState,
    solvers: [prevState.solvers[0], prevState.solvers[1]] as [typeof prevState.solvers[0], typeof prevState.solvers[1]],
    trails: [
      [...prevState.trails[0], { ...prevState.solvers[0], time: currentTime }],
      [...prevState.trails[1], { ...prevState.solvers[1], time: currentTime }]
    ] as [typeof prevState.trails[0], typeof prevState.trails[1]]
  };

  // Check if either solver has reached (0,0)
  const solver1AtGoal = newState.solvers[0].row === 0 && newState.solvers[0].col === 0;
  const solver2AtGoal = newState.solvers[1].row === 0 && newState.solvers[1].col === 0;

  return {
    ...newState,
    solved: solver1AtGoal || solver2AtGoal
  };
}
