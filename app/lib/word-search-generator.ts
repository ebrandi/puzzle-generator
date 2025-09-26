
import { WordEntry, WordSearchGrid, WordSearchWord, CrosswordConfig, GenerationResult } from './types';
import { WordDatabase } from './word-database';

export class WordSearchGenerator {
  private grid: string[][];
  private placedWords: WordSearchWord[] = [];
  private wordList: string[] = [];
  private config: CrosswordConfig;

  constructor(config: CrosswordConfig) {
    this.config = config;
    this.grid = Array(config.gridSize)
      .fill(null)
      .map(() => Array(config.gridSize).fill(''));
    this.placedWords = [];
    this.wordList = [];
  }

  async generateWordSearch(): Promise<GenerationResult> {
    try {
      const wordDatabase = WordDatabase.getInstance();
      const availableWords = await wordDatabase.getWordsForGeneration(
        this.config.themes,
        this.config.difficulty,
        this.config.wordCount * 2, // Get more words to choose from
        this.config.language
      );

      if (availableWords.length < 5) {
        return {
          success: false,
          error: `Not enough words available. Found ${availableWords.length}, need at least 5`
        };
      }

      // Sort words by length and select the best ones
      const sortedWords = availableWords.sort((a, b) => b.word.length - a.word.length);
      const wordsToUse = sortedWords.slice(0, Math.min(this.config.wordCount, sortedWords.length));

      // Place words in the grid
      let placedCount = 0;
      const maxAttempts = 100;

      for (const wordEntry of wordsToUse) {
        let attempts = 0;
        let placed = false;

        while (attempts < maxAttempts && !placed) {
          const direction = this.getRandomDirection();
          const position = this.getRandomPosition(wordEntry.word.length, direction);

          if (position && this.canPlaceWord(wordEntry.word, position.row, position.col, direction)) {
            this.placeWord(wordEntry.word, position.row, position.col, direction);
            this.placedWords.push({
              word: wordEntry.word,
              startRow: position.row,
              startCol: position.col,
              direction: direction
            });
            this.wordList.push(wordEntry.word);
            placedCount++;
            placed = true;
          }
          attempts++;
        }
      }

      // Fill empty cells with random letters
      this.fillEmptyCells();

      if (placedCount < 5) {
        return {
          success: false,
          error: `Could only place ${placedCount} words. Minimum required: 5`
        };
      }

      return {
        success: true,
        wordSearch: {
          grid: this.grid,
          placedWords: this.placedWords,
          wordList: this.wordList
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private getRandomDirection(): WordSearchWord['direction'] {
    // Prioritize diagonal directions for more interesting puzzles
    const directions: WordSearchWord['direction'][] = [
      'horizontal',
      'vertical', 
      'diagonal',
      'diagonal', // Double weight for diagonal
      'reverse-horizontal',
      'reverse-vertical',
      'reverse-diagonal',
      'reverse-diagonal' // Double weight for reverse diagonal
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private getRandomPosition(wordLength: number, direction: WordSearchWord['direction']): { row: number; col: number } | null {
    const size = this.config.gridSize;
    let maxRow = size;
    let maxCol = size;

    // Calculate maximum position based on direction and word length
    switch (direction) {
      case 'horizontal':
        maxCol = size - wordLength + 1;
        break;
      case 'vertical':
        maxRow = size - wordLength + 1;
        break;
      case 'diagonal':
        maxRow = size - wordLength + 1;
        maxCol = size - wordLength + 1;
        break;
      case 'reverse-horizontal':
        maxCol = size - wordLength + 1;
        break;
      case 'reverse-vertical':
        maxRow = size - wordLength + 1;
        break;
      case 'reverse-diagonal':
        maxRow = size - wordLength + 1;
        maxCol = size - wordLength + 1;
        break;
    }

    if (maxRow <= 0 || maxCol <= 0) return null;

    return {
      row: Math.floor(Math.random() * maxRow),
      col: Math.floor(Math.random() * maxCol)
    };
  }

  private canPlaceWord(word: string, startRow: number, startCol: number, direction: WordSearchWord['direction']): boolean {
    const positions = this.getWordPositions(word, startRow, startCol, direction);
    
    for (let i = 0; i < positions.length; i++) {
      const { row, col } = positions[i];
      const letter = word[i].toUpperCase();

      // Check bounds
      if (row < 0 || row >= this.config.gridSize || col < 0 || col >= this.config.gridSize) {
        return false;
      }

      // Check if cell is empty or has the same letter
      const currentCell = this.grid[row][col];
      if (currentCell !== '' && currentCell !== letter) {
        return false;
      }
    }

    return true;
  }

  private placeWord(word: string, startRow: number, startCol: number, direction: WordSearchWord['direction']): void {
    const positions = this.getWordPositions(word, startRow, startCol, direction);
    
    for (let i = 0; i < positions.length; i++) {
      const { row, col } = positions[i];
      this.grid[row][col] = word[i].toUpperCase();
    }
  }

  private getWordPositions(word: string, startRow: number, startCol: number, direction: WordSearchWord['direction']): { row: number; col: number }[] {
    const positions: { row: number; col: number }[] = [];
    
    for (let i = 0; i < word.length; i++) {
      let row = startRow;
      let col = startCol;

      switch (direction) {
        case 'horizontal':
          col += i;
          break;
        case 'vertical':
          row += i;
          break;
        case 'diagonal':
          row += i;
          col += i;
          break;
        case 'reverse-horizontal':
          col += word.length - 1 - i;
          break;
        case 'reverse-vertical':
          row += word.length - 1 - i;
          break;
        case 'reverse-diagonal':
          row += word.length - 1 - i;
          col += word.length - 1 - i;
          break;
      }

      positions.push({ row, col });
    }

    return positions;
  }

  private fillEmptyCells(): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < this.config.gridSize; row++) {
      for (let col = 0; col < this.config.gridSize; col++) {
        if (this.grid[row][col] === '') {
          this.grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }
}
