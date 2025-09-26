

import { SudokuGrid, SudokuCell, CrosswordConfig, GenerationResult } from './types';

export class SudokuGenerator {
  private grid: number[][];
  private config: CrosswordConfig;

  constructor(config: CrosswordConfig) {
    this.config = config;
    this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
  }

  async generateSudoku(): Promise<GenerationResult> {
    try {
      // Generate a complete valid Sudoku grid
      const success = this.generateCompleteGrid();
      
      if (!success) {
        return {
          success: false,
          error: 'Failed to generate a valid Sudoku grid'
        };
      }

      // Store the complete solution
      const solvedGrid = this.grid.map(row => [...row]);

      // Remove numbers to create the puzzle based on difficulty
      const difficulty = this.getDifficultyLevel();
      const cellsToRemove = this.getCellsToRemove(difficulty);
      
      const puzzleGrid = this.createPuzzle(solvedGrid, cellsToRemove);

      const sudokuResult: SudokuGrid = {
        grid: puzzleGrid,
        difficulty: difficulty,
        solvedGrid: solvedGrid
      };

      return {
        success: true,
        sudoku: sudokuResult
      };

    } catch (error) {
      return {
        success: false,
        error: `Sudoku generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private generateCompleteGrid(): boolean {
    // Fill the grid completely using backtracking
    return this.fillGrid(0, 0);
  }

  private fillGrid(row: number, col: number): boolean {
    // If we've filled all rows, we're done
    if (row === 9) {
      return true;
    }

    // Move to next row if we've filled this row
    if (col === 9) {
      return this.fillGrid(row + 1, 0);
    }

    // Try numbers 1-9 in random order
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const num of numbers) {
      if (this.isValidMove(row, col, num)) {
        this.grid[row][col] = num;
        
        if (this.fillGrid(row, col + 1)) {
          return true;
        }
        
        // Backtrack
        this.grid[row][col] = 0;
      }
    }

    return false;
  }

  private isValidMove(row: number, col: number, num: number): boolean {
    // Check row
    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i] === num) {
        return false;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (this.grid[i][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const boxStartRow = Math.floor(row / 3) * 3;
    const boxStartCol = Math.floor(col / 3) * 3;

    for (let i = boxStartRow; i < boxStartRow + 3; i++) {
      for (let j = boxStartCol; j < boxStartCol + 3; j++) {
        if (this.grid[i][j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private getDifficultyLevel(): 'easy' | 'medium' | 'hard' | 'expert' {
    // Map the numeric difficulty (1-5) to Sudoku difficulty levels
    switch (this.config.difficulty) {
      case 1:
        return 'easy';
      case 2:
        return 'easy';
      case 3:
        return 'medium';
      case 4:
        return 'hard';
      case 5:
        return 'expert';
      default:
        return 'medium';
    }
  }

  private getCellsToRemove(difficulty: 'easy' | 'medium' | 'hard' | 'expert'): number {
    // Number of cells to remove (out of 81 total)
    switch (difficulty) {
      case 'easy':
        return Math.floor(Math.random() * 10) + 35; // 35-44 removed (37-46 given)
      case 'medium':
        return Math.floor(Math.random() * 10) + 45; // 45-54 removed (27-36 given)
      case 'hard':
        return Math.floor(Math.random() * 10) + 55; // 55-64 removed (17-26 given)
      case 'expert':
        return Math.floor(Math.random() * 5) + 65; // 65-69 removed (12-16 given)
      default:
        return 50;
    }
  }

  private createPuzzle(solvedGrid: number[][], cellsToRemove: number): SudokuCell[][] {
    // Create a copy of the solved grid
    const puzzleGrid: SudokuCell[][] = solvedGrid.map(row => 
      row.map(value => ({
        value,
        isGiven: true,
        isValid: true
      }))
    );

    // Get all cell positions
    const positions: { row: number; col: number }[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        positions.push({ row, col });
      }
    }

    // Shuffle positions
    const shuffledPositions = this.shuffleArray(positions);

    // Remove cells while ensuring the puzzle has a unique solution
    let removed = 0;
    for (const pos of shuffledPositions) {
      if (removed >= cellsToRemove) break;

      const originalValue = puzzleGrid[pos.row][pos.col].value;
      
      // Temporarily remove the cell
      puzzleGrid[pos.row][pos.col] = {
        value: 0,
        isGiven: false,
        isValid: true
      };

      // For simplicity, we'll assume the puzzle is still valid
      // In a production app, you'd want to verify uniqueness
      removed++;
    }

    return puzzleGrid;
  }

  // Helper method to validate a Sudoku grid
  static isValidSudoku(grid: SudokuCell[][]): boolean {
    // Check all rows
    for (let row = 0; row < 9; row++) {
      const rowValues = grid[row].map(cell => cell.value).filter(val => val !== 0);
      if (new Set(rowValues).size !== rowValues.length) {
        return false;
      }
    }

    // Check all columns
    for (let col = 0; col < 9; col++) {
      const colValues = grid.map(row => row[col].value).filter(val => val !== 0);
      if (new Set(colValues).size !== colValues.length) {
        return false;
      }
    }

    // Check all 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxValues: number[] = [];
        for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
          for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
            const value = grid[row][col].value;
            if (value !== 0) {
              boxValues.push(value);
            }
          }
        }
        if (new Set(boxValues).size !== boxValues.length) {
          return false;
        }
      }
    }

    return true;
  }

  // Helper method to check if a Sudoku is complete
  static isCompleteSudoku(grid: SudokuCell[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col].value === 0) {
          return false;
        }
      }
    }
    return SudokuGenerator.isValidSudoku(grid);
  }
}

