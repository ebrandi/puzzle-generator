
import { WordEntry, ThemeId } from './types';

export class WordDatabase {
  private static instance: WordDatabase;
  private wordCache: Map<string, WordEntry[]> = new Map();

  static getInstance(): WordDatabase {
    if (!WordDatabase.instance) {
      WordDatabase.instance = new WordDatabase();
    }
    return WordDatabase.instance;
  }

  async loadThemeWords(themeId: ThemeId, languageId: string = 'en'): Promise<WordEntry[]> {
    const cacheKey = `${languageId}-${themeId}`;
    if (this.wordCache.has(cacheKey)) {
      return this.wordCache.get(cacheKey) || [];
    }

    try {
      // Try language-specific file first, then fall back to English
      let response = await fetch(`/data/${languageId}/${themeId}.txt`);
      if (!response.ok && languageId !== 'en') {
        console.warn(`Language-specific file not found for ${languageId}-${themeId}, falling back to English`);
        response = await fetch(`/data/en/${themeId}.txt`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${themeId} for language: ${languageId}`);
      }

      const content = await response.text();
      const words = this.parseWordFile(content);
      this.wordCache.set(cacheKey, words);
      return words;
    } catch (error) {
      console.error(`Error loading theme ${themeId} for language ${languageId}:`, error);
      return [];
    }
  }

  private parseWordFile(content: string): WordEntry[] {
    const lines = content.split('\n');
    const words: WordEntry[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const parts = trimmed.split('|');
      if (parts.length >= 3) {
        words.push({
          word: parts[0].trim(),
          clue: parts[1].trim(),
          difficulty: parseInt(parts[2].trim()) || 1
        });
      }
    }

    return words;
  }

  async getWordsForGeneration(
    themes: ThemeId[], 
    difficulty: number, 
    minWords: number,
    languageId: string = 'en'
  ): Promise<WordEntry[]> {
    const allWords: WordEntry[] = [];

    for (const theme of themes) {
      const themeWords = await this.loadThemeWords(theme, languageId);
      // Filter by difficulty (be more lenient to get more words)
      const filteredWords = themeWords.filter(word => 
        word.difficulty >= 1 && word.difficulty <= 3 // Allow all difficulties if needed
      );
      allWords.push(...filteredWords);
    }

    // Remove duplicates
    const uniqueWords = allWords.filter((word, index, self) => 
      index === self.findIndex(w => w.word.toLowerCase() === word.word.toLowerCase())
    );

    // Shuffle and return more words than requested
    const shuffled = this.shuffleArray([...uniqueWords]);
    return shuffled.slice(0, Math.max(minWords, shuffled.length));
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
