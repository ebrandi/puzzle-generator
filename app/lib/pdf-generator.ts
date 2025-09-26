
'use client';

import { CrosswordGrid, WordSearchGrid, SudokuGrid } from './types';

export class PDFGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
  }

  async generatePuzzlePDF(
    crossword: CrosswordGrid, 
    title: string = 'Crossword Puzzle',
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): Promise<string> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    
    // Set up page
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    
    // Professional header
    await this.drawProfessionalHeader(pdf, title, pageWidth, margin, config);
    
    // Grid dimensions - better positioning
    const gridSize = crossword.grid.length;
    const headerHeight = 90; // Increased to account for logo space
    const availableSpace = pageHeight - headerHeight; // Space after header and before footer
    const maxGridSize = Math.min(contentWidth * 0.7, availableSpace * 0.6);
    const cellSize = maxGridSize / gridSize;
    const gridWidth = gridSize * cellSize;
    const gridHeight = gridSize * cellSize;
    const gridStartX = (pageWidth - gridWidth) / 2; // Center the grid
    const gridStartY = 60; // Adjusted for logo space
    
    // Draw grid
    this.drawPuzzleGrid(pdf, crossword, gridStartX, gridStartY, cellSize, false);
    
    // Clues section - better positioning
    const cluesStartY = gridStartY + gridHeight + 10;
    const remainingSpace = pageHeight - cluesStartY - 30; // Space before footer
    this.drawProfessionalClues(pdf, crossword.clues, margin, cluesStartY, contentWidth, remainingSpace);
    
    // Add professional footer
    this.addProfessionalFooter(pdf, pageWidth, pageHeight, config);
    
    return pdf.output('datauristring');
  }

  async generateAnswerKeyPDF(
    crossword: CrosswordGrid, 
    title: string = 'Crossword Answer Key',
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): Promise<string> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    
    // Set up page
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    
    // Professional header
    await this.drawProfessionalHeader(pdf, title, pageWidth, margin, config);
    
    // Grid dimensions - centered and properly sized
    const gridSize = crossword.grid.length;
    const headerHeight = 90; // Account for logo space
    const availableSpace = Math.min(contentWidth, pageHeight - headerHeight - 40);
    const cellSize = availableSpace * 0.8 / gridSize;
    const gridWidth = gridSize * cellSize;
    const gridHeight = gridSize * cellSize;
    const gridStartX = (pageWidth - gridWidth) / 2; // Center the grid
    const gridStartY = 70; // Adjusted for logo space
    
    // Draw grid with answers
    this.drawPuzzleGrid(pdf, crossword, gridStartX, gridStartY, cellSize, true);
    
    // Add professional footer
    this.addProfessionalFooter(pdf, pageWidth, pageHeight, config);
    
    return pdf.output('datauristring');
  }

  private drawPuzzleGrid(
    pdf: any,
    crossword: CrosswordGrid,
    startX: number,
    startY: number,
    cellSize: number,
    showAnswers: boolean
  ): void {
    const gridSize = crossword.grid.length;
    
    // Create number map for grid positions
    const numberMap: { [key: string]: number } = {};
    crossword.placedWords.forEach(word => {
      const key = `${word.startRow}-${word.startCol}`;
      if (!numberMap[key] || numberMap[key] > word.number) {
        numberMap[key] = word.number;
      }
    });
    
    // First, fill all cells (background colors only)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;
        const hasLetter = crossword.grid[row][col] !== '';
        
        if (hasLetter) {
          // White cell for letters
          pdf.setFillColor(255, 255, 255);
          pdf.rect(x, y, cellSize, cellSize, 'F');
        } else {
          // Light gray cell for unused spaces
          pdf.setFillColor(220, 220, 220);
          pdf.rect(x, y, cellSize, cellSize, 'F');
        }
      }
    }
    
    // Draw uniform grid lines for letter cells only
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.4); // Standard line width for all borders
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;
        const hasLetter = crossword.grid[row][col] !== '';
        
        if (hasLetter) {
          // Draw borders only for letter cells to create clean, uniform lines
          // Top border
          if (row === 0 || crossword.grid[row - 1][col] === '') {
            pdf.line(x, y, x + cellSize, y);
          }
          // Left border
          if (col === 0 || crossword.grid[row][col - 1] === '') {
            pdf.line(x, y, x, y + cellSize);
          }
          // Bottom border
          if (row === gridSize - 1 || crossword.grid[row + 1][col] === '') {
            pdf.line(x, y + cellSize, x + cellSize, y + cellSize);
          }
          // Right border
          if (col === gridSize - 1 || crossword.grid[row][col + 1] === '') {
            pdf.line(x + cellSize, y, x + cellSize, y + cellSize);
          }
          
          // Internal borders between letter cells
          if (row < gridSize - 1 && crossword.grid[row + 1][col] !== '') {
            pdf.line(x, y + cellSize, x + cellSize, y + cellSize);
          }
          if (col < gridSize - 1 && crossword.grid[row][col + 1] !== '') {
            pdf.line(x + cellSize, y, x + cellSize, y + cellSize);
          }
        }
      }
    }
    
    // Add numbers and letters after grid is complete
    pdf.setTextColor(0, 0, 0);
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;
        const hasLetter = crossword.grid[row][col] !== '';
        
        if (hasLetter) {
          // Add number if this is a word start
          const key = `${row}-${col}`;
          if (numberMap[key]) {
            pdf.setFontSize(6);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(numberMap[key].toString(), x + 1, y + 3);
          }
          
          // Add letter if showing answers
          if (showAnswers && crossword.grid[row][col]) {
            pdf.setFontSize(Math.max(8, cellSize * 0.4));
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            const letter = crossword.grid[row][col];
            pdf.text(letter, x + cellSize / 2, y + cellSize / 2 + 2, { align: 'center' });
          }
        }
      }
    }
  }

  private drawClues(
    pdf: any,
    clues: { across: Array<{ number: number; clue: string }>; down: Array<{ number: number; clue: string }> },
    startX: number,
    startY: number,
    maxWidth: number
  ): void {
    let currentY = startY;
    const columnWidth = maxWidth / 2 - 5;
    
    // Across clues
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACROSS', startX, currentY);
    currentY += 5;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    clues.across.forEach(clue => {
      const text = `${clue.number}. ${clue.clue}`;
      const lines = pdf.splitTextToSize(text, columnWidth);
      pdf.text(lines, startX, currentY);
      currentY += lines.length * 4;
    });
    
    // Down clues
    let downY = startY;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DOWN', startX + columnWidth + 10, downY);
    downY += 5;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    clues.down.forEach(clue => {
      const text = `${clue.number}. ${clue.clue}`;
      const lines = pdf.splitTextToSize(text, columnWidth);
      pdf.text(lines, startX + columnWidth + 10, downY);
      downY += lines.length * 4;
    });
  }

  private addFooter(pdf: any, pageWidth: number, pageHeight: number): void {
    const footerY = pageHeight - 10; // 10mm from bottom
    const footerMessage = "This puzzle is lovingly provided by Ebrandi. Happy solving!";
    
    // Set footer style
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100); // Gray color
    
    // Center the footer text
    pdf.text(footerMessage, pageWidth / 2, footerY, { align: 'center' });
    
    // Reset text color to black for other content
    pdf.setTextColor(0, 0, 0);
  }

  private async drawProfessionalHeader(
    pdf: any, 
    title: string, 
    pageWidth: number, 
    margin: number, 
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): Promise<void> {
    try {
      // Load and add logo
      const logoImg = await this.loadLogoImage();
      if (logoImg) {
        // Custom logo - using actual size to avoid distortion
        const logoSize = 20; // Square logo - 20mm x 20mm for good visibility
        const logoX = (pageWidth - logoSize) / 2; // Center horizontally
        const logoY = margin;
        
        pdf.addImage(logoImg, 'PNG', logoX, logoY, logoSize, logoSize);
      }
      
      // Adjust title position to account for logo
      const titleY = margin + (logoImg ? 24 : 12);
      
      // Title
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(25, 25, 112); // Dark blue
      pdf.text(title, pageWidth / 2, titleY, { align: 'center' });
      
      // Subtitle with puzzle info
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(70, 70, 70); // Dark gray
      
      const currentDate = new Date().toLocaleDateString();
      let subtitle = `Created on ${currentDate}`;
      
      if (config?.language) {
        const languageNames = { 'en': 'English', 'pt': 'Português', 'es': 'Español' };
        subtitle += ` | Language: ${languageNames[config.language as keyof typeof languageNames] || config.language}`;
      }
      
      if (config?.difficulty) {
        const difficultyNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
        subtitle += ` | Difficulty: ${difficultyNames[config.difficulty as keyof typeof difficultyNames] || config.difficulty}`;
      }
      
      pdf.text(subtitle, pageWidth / 2, titleY + 8, { align: 'center' });
      
      // Theme information (only for non-Sudoku puzzles)
      if (config?.themes && config.themes.length > 0 && !title.toLowerCase().includes('sudoku')) {
        pdf.setFontSize(9);
        pdf.setTextColor(50, 50, 50);
        const themesText = `Themes: ${config.themes.join(', ')}`;
        pdf.text(themesText, pageWidth / 2, titleY + 16, { align: 'center' });
      }
      
      // Reset colors
      pdf.setTextColor(0, 0, 0);
      pdf.setDrawColor(0, 0, 0);
    } catch (error) {
      console.error('Error loading logo for PDF:', error);
      // Fallback to original header without logo
      this.drawOriginalHeader(pdf, title, pageWidth, margin, config);
    }
  }

  private drawOriginalHeader(
    pdf: any, 
    title: string, 
    pageWidth: number, 
    margin: number, 
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): void {
    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 25, 112); // Dark blue
    pdf.text(title, pageWidth / 2, margin + 12, { align: 'center' });
    
    // Subtitle with puzzle info
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(70, 70, 70); // Dark gray
    
    const currentDate = new Date().toLocaleDateString();
    let subtitle = `Created on ${currentDate}`;
    
    if (config?.language) {
      const languageNames = { 'en': 'English', 'pt': 'Português', 'es': 'Español' };
      subtitle += ` | Language: ${languageNames[config.language as keyof typeof languageNames] || config.language}`;
    }
    
    if (config?.difficulty) {
      const difficultyNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
      subtitle += ` | Difficulty: ${difficultyNames[config.difficulty as keyof typeof difficultyNames] || config.difficulty}`;
    }
    
    pdf.text(subtitle, pageWidth / 2, margin + 20, { align: 'center' });
    
    // Theme information (only for non-Sudoku puzzles)
    if (config?.themes && config.themes.length > 0 && !title.toLowerCase().includes('sudoku')) {
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      const themesText = `Themes: ${config.themes.join(', ')}`;
      pdf.text(themesText, pageWidth / 2, margin + 28, { align: 'center' });
    }
    
    // Reset colors
    pdf.setTextColor(0, 0, 0);
    pdf.setDrawColor(0, 0, 0);
  }

  private async loadLogoImage(): Promise<string | null> {
    try {
      const response = await fetch('/logos/logo-custom.png');
      if (!response.ok) {
        throw new Error('Failed to fetch logo');
      }
      
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to load logo image:', error);
      return null;
    }
  }

  private drawProfessionalClues(
    pdf: any,
    clues: { across: Array<{ number: number; clue: string }>; down: Array<{ number: number; clue: string }> },
    startX: number,
    startY: number,
    maxWidth: number,
    maxHeight: number
  ): void {
    const columnWidth = (maxWidth - 10) / 2;
    let acrossY = startY;
    let downY = startY;
    
    // Across clues header
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 25, 112);
    pdf.text('ACROSS', startX, acrossY);
    acrossY += 8;
    
    // Down clues header
    pdf.text('DOWN', startX + columnWidth + 10, downY);
    downY += 8;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    // Draw across clues
    clues.across.forEach((clue, index) => {
      if (acrossY > startY + maxHeight - 10) return; // Don't overflow page
      
      const text = `${clue.number}. ${clue.clue}`;
      const lines = pdf.splitTextToSize(text, columnWidth);
      
      pdf.text(lines, startX, acrossY);
      acrossY += lines.length * 4 + 1;
    });
    
    // Draw down clues
    clues.down.forEach((clue, index) => {
      if (downY > startY + maxHeight - 10) return; // Don't overflow page
      
      const text = `${clue.number}. ${clue.clue}`;
      const lines = pdf.splitTextToSize(text, columnWidth);
      
      pdf.text(lines, startX + columnWidth + 10, downY);
      downY += lines.length * 4 + 1;
    });
  }

  private addProfessionalFooter(
    pdf: any, 
    pageWidth: number, 
    pageHeight: number, 
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): void {
    const footerY = pageHeight - 15;
    
    // Decorative line
    pdf.setDrawColor(25, 25, 112);
    pdf.setLineWidth(0.3);
    pdf.line(15, footerY - 5, pageWidth - 15, footerY - 5);
    
    // Main footer message
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(25, 25, 112);
    const mainMessage = "Ebrandi Puzzle Generator";
    pdf.text(mainMessage, pageWidth / 2, footerY, { align: 'center' });
    
    // Secondary message
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const secondaryMessage = "This puzzle is lovingly provided by Ebrandi. Happy solving!";
    pdf.text(secondaryMessage, pageWidth / 2, footerY + 5, { align: 'center' });
    
    // Reset colors
    pdf.setTextColor(0, 0, 0);
    pdf.setDrawColor(0, 0, 0);
  }

  async generateWordSearchPuzzlePDF(
    wordSearch: WordSearchGrid,
    title: string = 'Word Search Puzzle',
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): Promise<string> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();

    // Set up page
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Professional header
    await this.drawProfessionalHeader(pdf, title, pageWidth, margin, config);

    // Grid dimensions
    const gridSize = wordSearch.grid.length;
    const headerHeight = 90;
    const availableSpace = pageHeight - headerHeight - 50; // Leave space for word list
    const maxGridSize = Math.min(contentWidth * 0.8, availableSpace * 0.6);
    const cellSize = maxGridSize / gridSize;
    const gridWidth = gridSize * cellSize;
    const gridHeight = gridSize * cellSize;
    const gridStartX = (pageWidth - gridWidth) / 2;
    const gridStartY = 60;

    // Draw word search grid
    this.drawWordSearchGrid(pdf, wordSearch, gridStartX, gridStartY, cellSize, false);

    // Draw word list
    const wordListY = gridStartY + gridHeight + 10;
    this.drawWordList(pdf, wordSearch.wordList, margin, wordListY, contentWidth);

    // Footer
    this.addProfessionalFooter(pdf, pageWidth, pageHeight, config);

    return pdf.output('dataurlstring');
  }

  async generateWordSearchAnswerKeyPDF(
    wordSearch: WordSearchGrid,
    title: string = 'Word Search Answer Key',
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): Promise<string> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();

    // Set up page
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Professional header
    await this.drawProfessionalHeader(pdf, title, pageWidth, margin, config);

    // Grid dimensions
    const gridSize = wordSearch.grid.length;
    const headerHeight = 90;
    const availableSpace = pageHeight - headerHeight - 50;
    const maxGridSize = Math.min(contentWidth * 0.8, availableSpace * 0.6);
    const cellSize = maxGridSize / gridSize;
    const gridWidth = gridSize * cellSize;
    const gridHeight = gridSize * cellSize;
    const gridStartX = (pageWidth - gridWidth) / 2;
    const gridStartY = 60;

    // Draw word search grid with answers highlighted
    this.drawWordSearchGrid(pdf, wordSearch, gridStartX, gridStartY, cellSize, true);

    // Draw word list
    const wordListY = gridStartY + gridHeight + 10;
    this.drawWordList(pdf, wordSearch.wordList, margin, wordListY, contentWidth);

    // Footer
    this.addProfessionalFooter(pdf, pageWidth, pageHeight, config);

    return pdf.output('dataurlstring');
  }

  private drawWordSearchGrid(
    pdf: any,
    wordSearch: WordSearchGrid,
    startX: number,
    startY: number,
    cellSize: number,
    showAnswers: boolean
  ): void {
    const { grid, placedWords } = wordSearch;
    const gridSize = grid.length;

    // Draw grid background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(startX, startY, gridSize * cellSize, gridSize * cellSize, 'F');

    // Highlight found words if showing answers
    if (showAnswers) {
      pdf.setFillColor(229, 231, 235); // Gray highlight (equivalent to gray-200)
      
      placedWords.forEach(placedWord => {
        const positions = this.getWordSearchPositions(placedWord, gridSize);
        positions.forEach(pos => {
          const x = startX + pos.col * cellSize;
          const y = startY + pos.row * cellSize;
          pdf.rect(x, y, cellSize, cellSize, 'F');
        });
      });
    }

    // Draw grid lines and letters
    pdf.setDrawColor(0, 0, 0);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(Math.max(8, Math.min(14, cellSize * 0.6)));

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;

        // Draw cell border
        pdf.rect(x, y, cellSize, cellSize);

        // Draw letter
        const letter = grid[row][col];
        const textX = x + cellSize / 2;
        const textY = y + cellSize / 2 + cellSize * 0.15; // Adjust for vertical centering
        pdf.text(letter, textX, textY, { align: 'center' });
      }
    }
  }

  private getWordSearchPositions(placedWord: any, gridSize: number): { row: number; col: number }[] {
    const positions: { row: number; col: number }[] = [];
    const { word, startRow, startCol, direction } = placedWord;

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

      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        positions.push({ row, col });
      }
    }

    return positions;
  }

  private drawWordList(
    pdf: any,
    wordList: string[],
    startX: number,
    startY: number,
    contentWidth: number
  ): void {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Words to Find:', startX, startY);

    const wordsPerColumn = Math.ceil(wordList.length / 3);
    const columnWidth = contentWidth / 3;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    wordList.forEach((word, index) => {
      const column = Math.floor(index / wordsPerColumn);
      const rowInColumn = index % wordsPerColumn;
      
      const x = startX + column * columnWidth;
      const y = startY + 10 + rowInColumn * 6;
      
      pdf.text(`• ${word.toUpperCase()}`, x, y);
    });
  }

  async generateSudokuPuzzlePDF(
    sudoku: any,
    title: string = 'Sudoku Puzzle',
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): Promise<string> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();

    // Set up page
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Professional header
    await this.drawProfessionalHeader(pdf, title, pageWidth, margin, config);

    // Grid dimensions
    const headerHeight = 90;
    const availableSpace = pageHeight - headerHeight - 50;
    const maxGridSize = Math.min(contentWidth * 0.8, availableSpace * 0.7);
    const cellSize = maxGridSize / 9;
    const gridWidth = 9 * cellSize;
    const gridHeight = 9 * cellSize;
    const gridStartX = (pageWidth - gridWidth) / 2;
    const gridStartY = 60;

    // Draw Sudoku grid
    this.drawSudokuGrid(pdf, sudoku, gridStartX, gridStartY, cellSize, false);

    // Draw instructions
    const instructionsY = gridStartY + gridHeight + 15;
    this.drawSudokuInstructions(pdf, margin, instructionsY, contentWidth);

    // Footer
    this.addProfessionalFooter(pdf, pageWidth, pageHeight, config);

    return pdf.output('dataurlstring');
  }

  async generateSudokuSolutionPDF(
    sudoku: any,
    title: string = 'Sudoku Solution',
    config?: { themes?: string[], language?: string, difficulty?: number }
  ): Promise<string> {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();

    // Set up page
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Professional header
    await this.drawProfessionalHeader(pdf, title, pageWidth, margin, config);

    // Grid dimensions
    const headerHeight = 90;
    const availableSpace = pageHeight - headerHeight - 50;
    const maxGridSize = Math.min(contentWidth * 0.8, availableSpace * 0.7);
    const cellSize = maxGridSize / 9;
    const gridWidth = 9 * cellSize;
    const gridHeight = 9 * cellSize;
    const gridStartX = (pageWidth - gridWidth) / 2;
    const gridStartY = 60;

    // Draw Sudoku grid with complete solution
    this.drawSudokuGrid(pdf, sudoku, gridStartX, gridStartY, cellSize, true);

    // Draw solution info
    const infoY = gridStartY + gridHeight + 15;
    this.drawSudokuSolutionInfo(pdf, margin, infoY, contentWidth, sudoku);

    // Footer
    this.addProfessionalFooter(pdf, pageWidth, pageHeight, config);

    return pdf.output('dataurlstring');
  }

  private drawSudokuGrid(
    pdf: any,
    sudoku: any,
    startX: number,
    startY: number,
    cellSize: number,
    showSolution: boolean
  ): void {
    const { grid, solvedGrid } = sudoku;

    // Draw grid background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(startX, startY, 9 * cellSize, 9 * cellSize, 'F');

    // Draw grid lines and numbers
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(Math.max(10, Math.min(16, cellSize * 0.6)));

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const x = startX + col * cellSize;
        const y = startY + row * cellSize;

        // Determine cell borders (thick for 3x3 box boundaries)
        const isTopBorder = row % 3 === 0;
        const isLeftBorder = col % 3 === 0;
        const isBottomBorder = row === 8 || (row + 1) % 3 === 0;
        const isRightBorder = col === 8 || (col + 1) % 3 === 0;

        // Draw cell background
        if (showSolution) {
          // Different color for given vs solved numbers
          if (grid[row][col].isGiven) {
            pdf.setFillColor(229, 231, 235); // Gray for given numbers
          } else {
            pdf.setFillColor(240, 253, 244); // Light green for solved numbers
          }
        } else {
          // Light background for given numbers
          if (grid[row][col].isGiven) {
            pdf.setFillColor(249, 250, 251);
          } else {
            pdf.setFillColor(255, 255, 255);
          }
        }
        pdf.rect(x, y, cellSize, cellSize, 'F');

        // Draw cell borders
        pdf.setDrawColor(0, 0, 0);
        
        // Top border
        pdf.setLineWidth(isTopBorder ? 2 : 0.5);
        pdf.line(x, y, x + cellSize, y);
        
        // Left border
        pdf.setLineWidth(isLeftBorder ? 2 : 0.5);
        pdf.line(x, y, x, y + cellSize);
        
        // Bottom border
        pdf.setLineWidth(isBottomBorder ? 2 : 0.5);
        pdf.line(x, y + cellSize, x + cellSize, y + cellSize);
        
        // Right border
        pdf.setLineWidth(isRightBorder ? 2 : 0.5);
        pdf.line(x + cellSize, y, x + cellSize, y + cellSize);

        // Draw number
        const value = showSolution ? solvedGrid[row][col] : grid[row][col].value;
        if (value !== 0) {
          // Set text color
          if (showSolution && !grid[row][col].isGiven) {
            pdf.setTextColor(22, 163, 74); // Green for solved numbers
          } else {
            pdf.setTextColor(0, 0, 0); // Black for given numbers
          }

          const textX = x + cellSize / 2;
          const textY = y + cellSize / 2 + cellSize * 0.15;
          pdf.text(value.toString(), textX, textY, { align: 'center' });
        }
      }
    }
  }

  private drawSudokuInstructions(
    pdf: any,
    startX: number,
    startY: number,
    contentWidth: number
  ): void {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('How to Solve Sudoku:', startX, startY);

    const instructions = [
      '• Fill each row with numbers 1-9 (no repeats)',
      '• Fill each column with numbers 1-9 (no repeats)',
      '• Fill each 3×3 box with numbers 1-9 (no repeats)',
      '• Use logic and elimination to find the unique solution'
    ];

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    instructions.forEach((instruction, index) => {
      const y = startY + 8 + (index * 6);
      pdf.text(instruction, startX, y);
    });
  }

  private drawSudokuSolutionInfo(
    pdf: any,
    startX: number,
    startY: number,
    contentWidth: number,
    sudoku: any
  ): void {
    const { grid, difficulty } = sudoku;
    const givenCells = grid.flat().filter((cell: any) => cell.isGiven).length;
    const solvedCells = 81 - givenCells;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Solution Information:', startX, startY);

    const info = [
      `Difficulty Level: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      `Given Clues: ${givenCells} numbers`,
      `Solved Cells: ${solvedCells} numbers`,
      'This puzzle has a unique solution verified by mathematical constraints.'
    ];

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    info.forEach((line, index) => {
      const y = startY + 8 + (index * 6);
      pdf.text(line, startX, y);
    });
  }
}
