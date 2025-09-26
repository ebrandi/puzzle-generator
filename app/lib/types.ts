
export interface WordEntry {
  word: string;
  clue: string;
  difficulty: number;
}

export interface PlacedWord {
  word: string;
  clue: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical';
  number: number;
  length: number;
}

export interface CrosswordGrid {
  grid: string[][];
  placedWords: PlacedWord[];
  clues: {
    across: Array<{ number: number; clue: string }>;
    down: Array<{ number: number; clue: string }>;
  };
}

export interface WordSearchWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'reverse-horizontal' | 'reverse-vertical' | 'reverse-diagonal';
}

export interface WordSearchGrid {
  grid: string[][];
  placedWords: WordSearchWord[];
  wordList: string[];
}

export interface SudokuCell {
  value: number; // 0 for empty, 1-9 for filled
  isGiven: boolean; // true if it's a clue (pre-filled), false if it's to be solved
  isValid?: boolean; // for validation display
}

export interface SudokuGrid {
  grid: SudokuCell[][];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  solvedGrid: number[][]; // Complete solution
}

export interface CrosswordConfig {
  gridSize: number;
  wordCount: number;
  themes: ThemeId[];
  difficulty: number;
  language: LanguageId;
  gameType: GameType;
}

export type GameType = 'crossword' | 'wordsearch' | 'sudoku';

export interface GenerationResult {
  success: boolean;
  crossword?: CrosswordGrid;
  wordSearch?: WordSearchGrid;
  sudoku?: SudokuGrid;
  error?: string;
}

export const AVAILABLE_LANGUAGES = [
  { id: 'en', name: 'English', flag: '/flags/us-flag.png' },
  { id: 'pt', name: 'Português', flag: '/flags/br-flag.png' },
  { id: 'es', name: 'Español', flag: '/flags/es-flag.png' }
] as const;

export const AVAILABLE_THEMES = [
  { id: 'general-knowledge', name: 'General Knowledge', description: 'Common knowledge and facts' },
  { id: 'science-nature', name: 'Science & Nature', description: 'Scientific concepts and natural world' },
  { id: 'history-geography', name: 'History & Geography', description: 'Historical events and world geography' },
  { id: 'literature', name: 'Literature', description: 'Books, authors, and literary terms' },
  { id: 'mathematics', name: 'Mathematics', description: 'Numbers, calculations, and geometric concepts' },
  { id: 'sports', name: 'Sports', description: 'Athletic activities and competitions' },
  { id: 'animals', name: 'Animals', description: 'Wildlife and domestic animals' },
  { id: 'technology', name: 'Technology', description: 'Computers, internet, and modern devices' },
  { id: 'arts-culture', name: 'Arts & Culture', description: 'Visual arts, music, and cultural topics' },
  { id: 'health', name: 'Health', description: 'Human body, medicine, and wellness' },
  { id: 'food-cooking', name: 'Food & Cooking', description: 'Culinary terms, ingredients, and cooking methods' },
  { id: 'entertainment', name: 'Entertainment', description: 'Movies, TV shows, music, and celebrities' },
  { id: 'travel-places', name: 'Travel & Places', description: 'Countries, cities, landmarks, and travel terms' },
  { id: 'business-work', name: 'Business & Work', description: 'Professional terms, careers, and workplace concepts' },
  { id: 'family-home', name: 'Family & Home', description: 'Household items, family relationships, and daily life' },
  { id: 'transportation', name: 'Transportation', description: 'Vehicles, travel methods, and transportation systems' }
] as const;

export type LanguageId = typeof AVAILABLE_LANGUAGES[number]['id'];
export type ThemeId = typeof AVAILABLE_THEMES[number]['id'];
