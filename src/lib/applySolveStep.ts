import type { State } from "../types";

// Track visited entrances (marks) for each solver
let marks1: { top: number; right: number; bottom: number; left: number }[][] | null = null;
let marks2: { top: number; right: number; bottom: number; left: number }[][] | null = null;

function moveRunner(
  runner: { row: number; col: number; color: string },
  marks: { top: number; right: number; bottom: number; left: number }[][],
  state: State
) {
  const { row, col } = runner;
  const moves = [];

  // Check each possible direction
  const directions = [
    { dir: "top", row: row - 1, col, wall: "top" },
    { dir: "right", row, col: col + 1, wall: "right" },
    { dir: "bottom", row: row + 1, col, wall: "bottom" },
    { dir: "left", row, col: col - 1, wall: "left" }
  ] as const;

  for (const { dir, row: newRow, col: newCol, wall } of directions) {
    if (!state.grid[row][col].walls[wall as keyof (typeof state.grid)[0][0]["walls"]] &&
        newRow >= 0 && newRow < state.rows &&
        newCol >= 0 && newCol < state.cols) {
      // Following Trémaux's rules with randomness for equal choices
      const markCount = marks[row][col][dir as keyof (typeof marks)[0][0]];
      if (markCount < 2) { // Only consider paths marked less than twice
        moves.push({ row: newRow, col: newCol, dir });
      }
    }
  }

  if (moves.length > 0) {
    // First prefer unmarked paths, then single-marked paths
    // For paths with equal marks, choose randomly
    moves.sort(() => Math.random() - 0.5);
    moves.sort((a, b) => {
      const aMarks = marks[row][col][a.dir as keyof (typeof marks)[0][0]];
      const bMarks = marks[row][col][b.dir as keyof (typeof marks)[0][0]];
      return aMarks - bMarks;
    });
    const move = moves[0];

    // Mark both sides of the passage
    marks[row][col][move.dir as keyof (typeof marks)[0][0]]++;
    const oppositeDir = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right"
    } as const;
    marks[move.row][move.col][oppositeDir[move.dir as keyof typeof oppositeDir]]++;

    runner.row = move.row;
    runner.col = move.col;
  }
}

export function applySolveStep(prevState: State): State {
  // Initialize marks if needed
  if (!marks1 || !marks2) {
    marks1 = Array(prevState.rows).fill(null).map(() =>
      Array(prevState.cols).fill(null).map(() => ({
        top: 0, right: 0, bottom: 0, left: 0
      })));
    marks2 = Array(prevState.rows).fill(null).map(() =>
      Array(prevState.cols).fill(null).map(() => ({
        top: 0, right: 0, bottom: 0, left: 0
      })));
  }

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

  // Continue until someone reaches the start (0,0)
  if ((prevState.solvers[0].row > 0 || prevState.solvers[0].col > 0) && 
      (prevState.solvers[1].row > 0 || prevState.solvers[1].col > 0)) {
    return newState;
  }
  return prevState;
}
