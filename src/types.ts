export type Cell = {
  visited: boolean;
  walls: { top: true; right: true; bottom: true; left: true };
};

export type Position = {
  row: number;
  col: number;
};

export type Solver = Position & {
  color: string;
};

export type Trail = Position & {
  time: number;
};
