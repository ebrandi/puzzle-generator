
import { WordEntry, PlacedWord, CrosswordGrid, CrosswordConfig, GenerationResult } from './types';
import { WordDatabase } from './word-database';

export class CrosswordGenerator {
  private grid: string[][];
  private placedWords: PlacedWord[] = [];
  private wordNumber: number = 1;
  private config: CrosswordConfig;

  constructor(config: CrosswordConfig) {
    this.config = config;
    this.grid = Array(config.gridSize)
      .fill(null)
      .map(() => Array(config.gridSize).fill(''));
    this.placedWords = [];
    this.wordNumber = 1;
  }

  async generateCrossword(): Promise<GenerationResult> {
    try {
      const wordDatabase = WordDatabase.getInstance();
      const availableWords = await wordDatabase.getWordsForGeneration(
        this.config.themes,
        this.config.difficulty,
        this.config.wordCount * 3, // Get more words to choose from
        this.config.language
      );

      if (availableWords.length < 5) {
        return {
          success: false,
          error: `Not enough words available. Found ${availableWords.length}, need at least 5`
        };
      }

      // Sort words by length (mix of longer and shorter words)
      const sortedWords = availableWords.sort((a, b) => b.word.length - a.word.length);
      
      // Use a better word mix
      const wordsToUse = this.selectBestWords(sortedWords);

      // Place the first word in the center
      if (wordsToUse.length > 0) {
        this.placeFirstWord(wordsToUse[0]);
      }

      // Try to place remaining words with multiple attempts
      let placedCount = 1;
      let wordIndex = 1;
      let attempts = 0;
      const maxAttempts = Math.min(wordsToUse.length * 10, 200);

      while (placedCount < this.config.wordCount && wordIndex < wordsToUse.length && attempts < maxAttempts) {
        const word = wordsToUse[wordIndex % wordsToUse.length];
        
        // Skip if already placed
        if (this.placedWords.some(pw => pw.word.toLowerCase() === word.word.toLowerCase())) {
          wordIndex++;
          continue;
        }

        if (this.placeWord(word)) {
          placedCount++;
          wordIndex++;
        } else {
          wordIndex++;
        }
        attempts++;
      }

      if (placedCount < Math.max(2, Math.min(this.config.wordCount * 0.6, 5))) {
        return {
          success: false,
          error: `Could only place ${placedCount} words. Try different settings.`
        };
      }

      // Generate clues
      const clues = this.generateClues();

      return {
        success: true,
        crossword: {
          grid: this.grid,
          placedWords: this.placedWords,
          clues
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private selectBestWords(words: WordEntry[]): WordEntry[] {
    const selected: WordEntry[] = [];
    const maxWords = Math.min(words.length, this.config.wordCount * 2);
    
    // Get a mix of different lengths
    const longWords = words.filter(w => w.word.length >= 6).slice(0, Math.ceil(maxWords * 0.3));
    const mediumWords = words.filter(w => w.word.length >= 4 && w.word.length <= 7).slice(0, Math.ceil(maxWords * 0.5));
    const shortWords = words.filter(w => w.word.length >= 3 && w.word.length <= 5).slice(0, Math.ceil(maxWords * 0.3));
    
    selected.push(...longWords);
    selected.push(...mediumWords);
    selected.push(...shortWords);
    
    // Remove duplicates and return
    const unique = selected.filter((word, index, self) => 
      index === self.findIndex(w => w.word.toLowerCase() === word.word.toLowerCase())
    );
    
    return unique.slice(0, maxWords);
  }

  private placeFirstWord(wordEntry: WordEntry): void {
    const word = wordEntry.word.toUpperCase();
    const centerRow = Math.floor(this.config.gridSize / 2);
    const startCol = Math.floor((this.config.gridSize - word.length) / 2);

    // Place horizontally in center
    for (let i = 0; i < word.length; i++) {
      this.grid[centerRow][startCol + i] = word[i];
    }

    this.placedWords.push({
      word: wordEntry.word,
      clue: wordEntry.clue,
      startRow: centerRow,
      startCol: startCol,
      direction: 'horizontal',
      number: this.wordNumber++,
      length: word.length
    });
  }

  private placeWord(wordEntry: WordEntry): boolean {
    const word = wordEntry.word.toUpperCase();
    
    // Try to find intersections with existing words (already sorted by score)
    const intersections = this.findPossibleIntersections(word);
    
    // Try top-scoring intersections first, with some randomness for variety
    const topIntersections = intersections.slice(0, Math.min(5, intersections.length));
    const randomizedTop = this.shuffleArray(topIntersections);
    
    for (const intersection of randomizedTop) {
      if (this.canPlaceWord(word, intersection.row, intersection.col, intersection.direction)) {
        this.placeWordAt(wordEntry, intersection.row, intersection.col, intersection.direction);
        return true;
      }
    }
    
    // If top intersections don't work, try the rest
    const remainingIntersections = intersections.slice(5);
    for (const intersection of remainingIntersections) {
      if (this.canPlaceWord(word, intersection.row, intersection.col, intersection.direction)) {
        this.placeWordAt(wordEntry, intersection.row, intersection.col, intersection.direction);
        return true;
      }
    }
    
    return false;
  }

  private findPossibleIntersections(word: string): Array<{row: number, col: number, direction: 'horizontal' | 'vertical', score: number}> {
    const intersections: Array<{row: number, col: number, direction: 'horizontal' | 'vertical', score: number}> = [];
    
    // Try to find intersections with existing words
    for (const placedWord of this.placedWords) {
      const placedWordUpper = placedWord.word.toUpperCase();
      
      // Find common letters
      for (let i = 0; i < word.length; i++) {
        for (let j = 0; j < placedWordUpper.length; j++) {
          if (word[i] === placedWordUpper[j]) {
            // Try to place perpendicular to existing word
            const newDirection = placedWord.direction === 'horizontal' ? 'vertical' : 'horizontal';
            
            let newRow: number, newCol: number;
            
            if (newDirection === 'vertical') {
              // New word goes vertical, intersecting horizontal word
              newRow = placedWord.startRow - i;
              newCol = placedWord.startCol + j;
            } else {
              // New word goes horizontal, intersecting vertical word
              newRow = placedWord.startRow + j;
              newCol = placedWord.startCol - i;
            }

            // Calculate score for this intersection (higher is better)
            const score = this.calculatePlacementScore(newRow, newCol, newDirection, word.length);
            
            intersections.push({
              row: newRow,
              col: newCol,
              direction: newDirection,
              score: score
            });
          }
        }
      }
    }
    
    // Sort intersections by score (highest first)
    return intersections.sort((a, b) => b.score - a.score);
  }

  private calculatePlacementScore(row: number, col: number, direction: 'horizontal' | 'vertical', wordLength: number): number {
    let score = 100; // Base score
    
    // Check distance from center (prefer middle of grid)
    const centerRow = Math.floor(this.config.gridSize / 2);
    const centerCol = Math.floor(this.config.gridSize / 2);
    const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol);
    score -= distanceFromCenter * 2; // Penalty for distance from center
    
    // Check for clustering - penalize placements near many existing words
    let nearbyWords = 0;
    const checkRadius = 2; // Check 2 cells around
    
    for (const placedWord of this.placedWords) {
      // Calculate minimum distance to this placed word
      let minDistance = Infinity;
      
      for (let i = 0; i < placedWord.length; i++) {
        let placedRow = placedWord.direction === 'horizontal' ? placedWord.startRow : placedWord.startRow + i;
        let placedCol = placedWord.direction === 'horizontal' ? placedWord.startCol + i : placedWord.startCol;
        
        for (let j = 0; j < wordLength; j++) {
          let newRow = direction === 'horizontal' ? row : row + j;
          let newCol = direction === 'horizontal' ? col + j : col;
          
          const distance = Math.abs(newRow - placedRow) + Math.abs(newCol - placedCol);
          minDistance = Math.min(minDistance, distance);
        }
      }
      
      if (minDistance <= checkRadius) {
        nearbyWords++;
      }
    }
    
    // Heavy penalty for clustering
    score -= nearbyWords * 15;
    
    // Bonus for balanced distribution
    if (direction === 'horizontal' && this.placedWords.filter(w => w.direction === 'vertical').length > this.placedWords.filter(w => w.direction === 'horizontal').length) {
      score += 10; // Bonus for balancing directions
    } else if (direction === 'vertical' && this.placedWords.filter(w => w.direction === 'horizontal').length > this.placedWords.filter(w => w.direction === 'vertical').length) {
      score += 10;
    }
    
    return score;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private canPlaceWord(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    // Check boundaries
    if (direction === 'horizontal') {
      if (col < 0 || col + word.length > this.config.gridSize || row < 0 || row >= this.config.gridSize) {
        return false;
      }
    } else {
      if (row < 0 || row + word.length > this.config.gridSize || col < 0 || col >= this.config.gridSize) {
        return false;
      }
    }

    // Check each position
    for (let i = 0; i < word.length; i++) {
      const checkRow = direction === 'horizontal' ? row : row + i;
      const checkCol = direction === 'horizontal' ? col + i : col;
      
      const existingLetter = this.grid[checkRow][checkCol];
      
      if (existingLetter !== '' && existingLetter !== word[i]) {
        return false;
      }
    }

    // Check for proper spacing (no adjacent words except at intersections)
    return this.checkSpacing(word, row, col, direction);
  }

  private checkSpacing(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    // Check before and after the word (must be empty or at boundary)
    if (direction === 'horizontal') {
      // Check cell before word
      if (col > 0 && this.grid[row][col - 1] !== '') {
        return false;
      }
      // Check cell after word
      if (col + word.length < this.config.gridSize && this.grid[row][col + word.length] !== '') {
        return false;
      }
    } else {
      // Check cell before word
      if (row > 0 && this.grid[row - 1][col] !== '') {
        return false;
      }
      // Check cell after word
      if (row + word.length < this.config.gridSize && this.grid[row + word.length][col] !== '') {
        return false;
      }
    }

    // Improved parallel word spacing check
    if (!this.checkParallelWordSpacing(word, row, col, direction)) {
      return false;
    }
    
    // Additional adjacent cell checks
    return this.checkAdjacentCells(word, row, col, direction);
  }

  private checkParallelWordSpacing(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    const minParallelDistance = 2; // Minimum distance between parallel words
    
    // Check for parallel words that are too close
    for (const placedWord of this.placedWords) {
      if (placedWord.direction === direction) {
        // Same direction - check if parallel and too close
        if (direction === 'horizontal') {
          const rowDistance = Math.abs(row - placedWord.startRow);
          if (rowDistance < minParallelDistance) {
            // Check if words would overlap horizontally
            const thisWordEnd = col + word.length - 1;
            const placedWordEnd = placedWord.startCol + placedWord.length - 1;
            
            if (!(thisWordEnd < placedWord.startCol || col > placedWordEnd)) {
              return false; // Too close parallel words
            }
          }
        } else {
          // Vertical words
          const colDistance = Math.abs(col - placedWord.startCol);
          if (colDistance < minParallelDistance) {
            // Check if words would overlap vertically
            const thisWordEnd = row + word.length - 1;
            const placedWordEnd = placedWord.startRow + placedWord.length - 1;
            
            if (!(thisWordEnd < placedWord.startRow || row > placedWordEnd)) {
              return false; // Too close parallel words
            }
          }
        }
      }
    }
    
    return true; // Spacing check passed
  }

  private checkAdjacentCells(word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    // More relaxed parallel spacing check - only prevent invalid letter combinations
    for (let i = 0; i < word.length; i++) {
      const checkRow = direction === 'horizontal' ? row : row + i;
      const checkCol = direction === 'horizontal' ? col + i : col;
      
      // Skip if this position already has the same letter (valid intersection)
      if (this.grid[checkRow][checkCol] === word[i]) {
        continue;
      }
      
      // Only check for direct adjacent conflicts that would create invalid words
      if (direction === 'horizontal') {
        // More lenient check - only block if there's a letter that would create an invalid pattern
        const hasAbove = row > 0 && this.grid[row - 1][checkCol] !== '';
        const hasBelow = row < this.config.gridSize - 1 && this.grid[row + 1][checkCol] !== '';
        
        // Only block if we have letters both above AND below (creating a cross pattern without intersection)
        if (hasAbove && hasBelow && this.grid[checkRow][checkCol] === '') {
          // Check if this would create a valid intersection
          const aboveLetter = this.grid[row - 1][checkCol];
          const belowLetter = this.grid[row + 1][checkCol];
          
          // Allow if it forms part of existing words
          const isPartOfVerticalWord = this.isPartOfExistingWord(row - 1, checkCol, 'vertical') || 
                                      this.isPartOfExistingWord(row + 1, checkCol, 'vertical');
          
          if (!isPartOfVerticalWord) {
            return false;
          }
        }
      } else {
        // Similar logic for vertical words
        const hasLeft = col > 0 && this.grid[checkRow][col - 1] !== '';
        const hasRight = col < this.config.gridSize - 1 && this.grid[checkRow][col + 1] !== '';
        
        if (hasLeft && hasRight && this.grid[checkRow][checkCol] === '') {
          const isPartOfHorizontalWord = this.isPartOfExistingWord(checkRow, col - 1, 'horizontal') || 
                                        this.isPartOfExistingWord(checkRow, col + 1, 'horizontal');
          
          if (!isPartOfHorizontalWord) {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  private isPartOfExistingWord(row: number, col: number, direction: 'horizontal' | 'vertical'): boolean {
    return this.placedWords.some(word => {
      if (word.direction !== direction) return false;
      
      if (direction === 'horizontal') {
        return word.startRow === row && 
               col >= word.startCol && 
               col < word.startCol + word.length;
      } else {
        return word.startCol === col && 
               row >= word.startRow && 
               row < word.startRow + word.length;
      }
    });
  }

  private placeWordAt(wordEntry: WordEntry, row: number, col: number, direction: 'horizontal' | 'vertical'): void {
    const word = wordEntry.word.toUpperCase();
    
    for (let i = 0; i < word.length; i++) {
      const placeRow = direction === 'horizontal' ? row : row + i;
      const placeCol = direction === 'horizontal' ? col + i : col;
      this.grid[placeRow][placeCol] = word[i];
    }

    this.placedWords.push({
      word: wordEntry.word,
      clue: wordEntry.clue,
      startRow: row,
      startCol: col,
      direction: direction,
      number: this.wordNumber++,
      length: word.length
    });
  }

  private generateClues(): { across: Array<{ number: number; clue: string }>; down: Array<{ number: number; clue: string }> } {
    const across: Array<{ number: number; clue: string }> = [];
    const down: Array<{ number: number; clue: string }> = [];

    for (const word of this.placedWords) {
      if (word.direction === 'horizontal') {
        across.push({
          number: word.number,
          clue: word.clue
        });
      } else {
        down.push({
          number: word.number,
          clue: word.clue
        });
      }
    }

    // Sort by number
    across.sort((a, b) => a.number - b.number);
    down.sort((a, b) => a.number - b.number);

    return { across, down };
  }
}
