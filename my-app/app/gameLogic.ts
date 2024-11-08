

export const GRID_SIZE = 6;
export const TILE_COLORS = ["red", "green", "blue", "yellow", "purple", "orange"];


export function generateInitialGrid(): string[][] {
  let grid = createInitialGrid();
  while (!hasPossibleMoves(grid)) {
    grid = createInitialGrid();
  }
  return grid;
}

function createInitialGrid(): string[][] {
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => randomColor())
  );
  removeInitialMatches(grid);
  return grid;
}

function randomColor(): string {
  return TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)];
}


function removeInitialMatches(grid: string[][]): void {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (
        row >= 2 &&
        grid[row][col] === grid[row - 1][col] &&
        grid[row][col] === grid[row - 2][col]
      ) {
        let newColor = randomColor();
        while (newColor === grid[row][col]) {
          newColor = randomColor();
        }
        grid[row][col] = newColor;
      }
      if (
        col >= 2 &&
        grid[row][col] === grid[row][col - 1] &&
        grid[row][col] === grid[row][col - 2]
      ) {
        let newColor = randomColor();
        while (newColor === grid[row][col]) {
          newColor = randomColor();
        }
        grid[row][col] = newColor;
      }
    }
  }
}

export function hasPossibleMoves(grid: string[][]): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const color = grid[row][col];

      if (col + 1 < GRID_SIZE) {
        swap(grid, row, col, row, col + 1);
        if (isMatchAt(grid, row, col) || isMatchAt(grid, row, col + 1)) {
          swap(grid, row, col, row, col + 1);
          return true;
        }
        swap(grid, row, col, row, col + 1);
      }

      if (row + 1 < GRID_SIZE) {
        swap(grid, row, col, row + 1, col);
        if (isMatchAt(grid, row, col) || isMatchAt(grid, row + 1, col)) {
          swap(grid, row, col, row + 1, col);
          return true;
        }
        swap(grid, row, col, row + 1, col);
      }
    }
  }
  return false;
}


function swap(grid: string[][], row1: number, col1: number, row2: number, col2: number): void {
  [grid[row1][col1], grid[row2][col2]] = [grid[row2][col2], grid[row1][col1]];
}

function isMatchAt(grid: string[][], row: number, col: number): boolean {
  const color = grid[row][col];

  let count = 1;
  let i = col - 1;
  while (i >= 0 && grid[row][i] === color) {
    count++;
    i--;
  }
  i = col + 1;
  while (i < GRID_SIZE && grid[row][i] === color) {
    count++;
    i++;
  }
  if (count >= 3) return true;

  
  count = 1;
  i = row - 1;
  while (i >= 0 && grid[i][col] === color) {
    count++;
    i--;
  }
  i = row + 1;
  while (i < GRID_SIZE && grid[i][col] === color) {
    count++;
    i++;
  }
  if (count >= 3) return true;

  return false;
}


export function findMatches(grid: string[][]): { row: number; col: number }[] {
  const matches: { row: number; col: number }[] = [];
  const checked = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const color = grid[row][col];

      if (col < GRID_SIZE - 2 && grid[row][col + 1] === color && grid[row][col + 2] === color) {
        let matchCol = col;
        while (matchCol < GRID_SIZE && grid[row][matchCol] === color) {
          if (!checked[row][matchCol]) {
            matches.push({ row, col: matchCol });
            checked[row][matchCol] = true;
          }
          matchCol++;
        }
      }

      if (row < GRID_SIZE - 2 && grid[row + 1][col] === color && grid[row + 2][col] === color) {
        let matchRow = row;
        while (matchRow < GRID_SIZE && grid[matchRow][col] === color) {
          if (!checked[matchRow][col]) {
            matches.push({ row: matchRow, col });
            checked[matchRow][col] = true;
          }
          matchRow++;
        }
      }
    }
  }

  return matches;
}

export function removeMatchesAndUpdateGrid(
  grid: (string | null)[][],
  matches: { row: number; col: number }[]
): string[][] {
  const newGrid = grid.map((row) => row.slice());

  matches.forEach(({ row, col }) => {
    newGrid[row][col] = null;
  });

  for (let col = 0; col < GRID_SIZE; col++) {
    let emptyCount = 0;
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (newGrid[row][col] === null) {
        emptyCount++;
      } else if (emptyCount > 0) {
        newGrid[row + emptyCount][col] = newGrid[row][col];
        newGrid[row][col] = null;
      }
    }
    for (let row = 0; row < emptyCount; row++) {
      newGrid[row][col] = randomColor();
    }
  }

  return newGrid;
}

export function swapTiles(
  grid: string[][],
  pos1: { row: number; col: number },
  pos2: { row: number; col: number }
): string[][] {
  const newGrid = grid.map((row) => row.slice());
  [newGrid[pos1.row][pos1.col], newGrid[pos2.row][pos2.col]] = [
    newGrid[pos2.row][pos2.col],
    newGrid[pos1.row][pos1.col],
  ];
  return newGrid;
}

export function isAdjacent(
  pos1: { row: number; col: number },
  pos2: { row: number; col: number }
): boolean {
  return (
    (Math.abs(pos1.row - pos2.row) === 1 && pos1.col === pos2.col) ||
    (Math.abs(pos1.col - pos2.col) === 1 && pos1.row === pos2.row)
  );
}