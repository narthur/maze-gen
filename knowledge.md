# Maze Generation Project

## Project Goals
- Generate mazes using depth-first search
- Visualize maze generation in real-time
- Race two solvers using Trémaux's algorithm
- Support configurable maze resolution via URL params

## Architecture Approaches

### Version 1 (/src/main.ts)
- Imperative style with mutable state
- Direct DOM manipulation
- Combines generation, solving, and rendering logic
- State managed through global variables
- Real-time animation using requestAnimationFrame

### Version 2 (/src/new.ts)
- Functional style with immutable state
- State machine pattern
- Separates concerns:
  - State management (updateState)
  - Rendering (renderState)
  - Initial setup (getInitialState)
- Pure functions for state transitions
- Same visual output and behavior as Version 1

## Key Algorithms

### Maze Generation
Uses randomized depth-first search:
1. Start from initial cell
2. Randomly choose unvisited neighbor
3. Remove wall between cells
4. Move to neighbor and repeat
5. Backtrack when no unvisited neighbors

### Maze Solving
Uses Trémaux's algorithm with randomness:
1. Mark passages when entering/exiting
2. At junction, prefer unmarked passages
3. Use random choice for equal options
4. Backtrack on doubly-marked passages
5. Trail shows last 15 positions with fading opacity

## URL Parameters
- cellSize: Controls maze resolution (default: 20)
  Example: /?cellSize=30

## Visual Style
- Background: #1a1a1a
- Walls: #4a4a4a
- Solver 1: Red with opacity trail
- Solver 2: Blue with opacity trail
