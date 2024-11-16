export type Cell = {
  visited: boolean;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
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
