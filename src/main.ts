import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <div>
    <canvas id="maze-canvas"></canvas>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#maze-canvas")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;
const params = new URLSearchParams(window.location.search);
let cellSize = Number(params.get('cellSize')) || 20;
let cols = Math.floor(canvas.width / cellSize);
let rows = Math.floor(canvas.height / cellSize);

// Initialize grid
let grid = Array(rows)
  .fill(null)
  .map(() =>
    Array(cols)
      .fill(null)
      .map(() => ({
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true },
      }))
  );

let current: { row: number; col: number } | null = null;
let stack: { row: number; col: number }[] = [];

// Start from top-left
current = { row: 0, col: 0 };
stack = [];
grid[0][0].visited = true;

// Start animation
step();

// Start from top-left
current = { row: 0, col: 0 };
stack = [];
grid[0][0].visited = true;

// Start animation
step();

function step() {
  if (!current) return;

  // Draw current state
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "#4a4a4a";
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      const x = j * cellSize;
      const y = i * cellSize;

      if (cell.walls.top) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellSize, y);
        ctx.stroke();
      }
      if (cell.walls.right) {
        ctx.beginPath();
        ctx.moveTo(x + cellSize, y);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.walls.bottom) {
        ctx.beginPath();
        ctx.moveTo(x, y + cellSize);
        ctx.lineTo(x + cellSize, y + cellSize);
        ctx.stroke();
      }
      if (cell.walls.left) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + cellSize);
        ctx.stroke();
      }
    });
  });

  // Highlight current cell
  if (current) {
    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
    ctx.fillRect(
      current.col * cellSize,
      current.row * cellSize,
      cellSize,
      cellSize
    );
  }

  // Get unvisited neighbors
  const neighbors = [];
  const { row, col } = current;

  if (row > 0 && !grid[row - 1][col].visited)
    neighbors.push({ row: row - 1, col, dir: "top" });
  if (col < cols - 1 && !grid[row][col + 1].visited)
    neighbors.push({ row, col: col + 1, dir: "right" });
  if (row < rows - 1 && !grid[row + 1][col].visited)
    neighbors.push({ row: row + 1, col, dir: "bottom" });
  if (col > 0 && !grid[row][col - 1].visited)
    neighbors.push({ row, col: col - 1, dir: "left" });

  if (neighbors.length > 0) {
    // Choose random neighbor
    const next = neighbors[Math.floor(Math.random() * neighbors.length)];

    // Remove walls between current and next
    if (next.dir === "top") {
      grid[current.row][current.col].walls.top = false;
      grid[next.row][next.col].walls.bottom = false;
    } else if (next.dir === "right") {
      grid[current.row][current.col].walls.right = false;
      grid[next.row][next.col].walls.left = false;
    } else if (next.dir === "bottom") {
      grid[current.row][current.col].walls.bottom = false;
      grid[next.row][next.col].walls.top = false;
    } else if (next.dir === "left") {
      grid[current.row][current.col].walls.left = false;
      grid[next.row][next.col].walls.right = false;
    }

    stack.push(current);
    current = next;
    grid[next.row][next.col].visited = true;
    requestAnimationFrame(step);
  } else if (stack.length > 0) {
    current = stack.pop()!;
    requestAnimationFrame(step);
  } else {
    // Maze is complete, start the race
    const solver1 = { row: rows - 1, col: cols - 1, color: "rgba(0,0,0,0)" };
    const solver2 = { row: rows - 1, col: cols - 1, color: "rgba(0,0,0,0)" };
    startRace(solver1, solver2);
  }
}

function startRace(
  solver1: { row: number; col: number; color: string },
  solver2: { row: number; col: number; color: string }
) {
  // Store trail positions and timestamps
  const trail1: { row: number; col: number; time: number }[] = [];
  const trail2: { row: number; col: number; time: number }[] = [];
  // Track visited entrances (marks) for each solver
  const marks1 = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }))
    );
  const marks2 = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }))
    );

  function moveRunner(
    runner: { row: number; col: number; color: string },
    marks: typeof marks1
  ) {
    const { row, col } = runner;
    const moves = [];

    // Check each possible direction
    const directions = [
      { dir: "top", row: row - 1, col, wall: "top" },
      { dir: "right", row, col: col + 1, wall: "right" },
      { dir: "bottom", row: row + 1, col, wall: "bottom" },
      { dir: "left", row, col: col - 1, wall: "left" },
    ] as const;

    for (const { dir, row: newRow, col: newCol, wall } of directions) {
      if (
        !grid[row][col].walls[wall as keyof (typeof grid)[0][0]["walls"]] &&
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols
      ) {
        // Following Trémaux's rules with randomness for equal choices
        const markCount = marks[row][col][dir as keyof (typeof marks)[0][0]];
        if (markCount < 2) {
          // Only consider paths marked less than twice
          moves.push({ row: newRow, col: newCol, dir });
        }
      }
    }

    if (moves.length > 0) {
      // Randomly choose among least-marked paths
      moves.sort(() => Math.random() - 0.5);
      moves.sort(
        (a, b) =>
          marks[row][col][a.dir as keyof (typeof marks)[0][0]] -
          marks[row][col][b.dir as keyof (typeof marks)[0][0]]
      );
      const move = moves[0];

      // Mark both sides of the passage
      marks[row][col][move.dir as keyof (typeof marks)[0][0]]++;
      const oppositeDir = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
      } as const;
      marks[move.row][move.col][
        oppositeDir[move.dir as keyof typeof oppositeDir]
      ]++;

      runner.row = move.row;
      runner.col = move.col;
    }
  }

  function raceStep() {
    const currentTime = Date.now();

    // Draw current state
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#4a4a4a";
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        const x = j * cellSize;
        const y = i * cellSize;

        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + cellSize, y);
          ctx.stroke();
        }
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(x + cellSize, y);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.stroke();
        }
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(x, y + cellSize);
          ctx.lineTo(x + cellSize, y + cellSize);
          ctx.stroke();
        }
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + cellSize);
          ctx.stroke();
        }
      });
    });

    // Draw trails (last 15 positions with decreasing opacity)
    const recentTrail1 = [...trail1].slice(-15).reverse();
    const recentTrail2 = [...trail2].slice(-15).reverse();

    recentTrail1.forEach((pos, idx) => {
      const opacity = 1 - idx / 15;
      ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
      ctx.fillRect(
        pos.col * cellSize + cellSize / 4,
        pos.row * cellSize + cellSize / 4,
        cellSize / 2,
        cellSize / 2
      );
    });

    recentTrail2.forEach((pos, idx) => {
      const opacity = 1 - idx / 15;
      ctx.fillStyle = `rgba(0, 0, 255, ${opacity})`;
      ctx.fillRect(
        pos.col * cellSize + cellSize / 4,
        pos.row * cellSize + cellSize / 4,
        cellSize / 2,
        cellSize / 2
      );
    });

    // Update trails
    trail1.push({ row: solver1.row, col: solver1.col, time: currentTime });
    trail2.push({ row: solver2.row, col: solver2.col, time: currentTime });

    // Move runners
    moveRunner(solver1, marks1);
    moveRunner(solver2, marks2);

    // Continue until someone reaches the start (0,0)
    if (
      (solver1.row > 0 || solver1.col > 0) &&
      (solver2.row > 0 || solver2.col > 0)
    ) {
      requestAnimationFrame(raceStep);
    }
  }

  requestAnimationFrame(raceStep);
}
