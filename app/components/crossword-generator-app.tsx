
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrosswordGrid, WordSearchGrid, SudokuGrid, CrosswordConfig, GenerationResult, AVAILABLE_THEMES, AVAILABLE_LANGUAGES, ThemeId } from '@/lib/types';
import { CrosswordGenerator } from '@/lib/crossword-generator';
import { WordSearchGenerator } from '@/lib/word-search-generator';
import { SudokuGenerator } from '@/lib/sudoku-generator';
import { PDFGenerator } from '@/lib/pdf-generator';
import ConfigurationPanel from './configuration-panel';
import CrosswordDisplay from './crossword-display';
import WordSearchDisplay from './word-search-display';
import SudokuDisplay from './sudoku-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Puzzle, 
  Download, 
  RefreshCw, 
  Loader2, 
  FileText, 
  Key,
  BookOpen,
  Settings
} from 'lucide-react';

export default function CrosswordGeneratorApp() {
  const [config, setConfig] = useState<CrosswordConfig>({
    gridSize: 15,
    wordCount: 15,
    themes: ['general-knowledge'],
    difficulty: 2,
    language: 'en',
    gameType: 'crossword'
  });

  const [crossword, setCrossword] = useState<CrosswordGrid | null>(null);
  const [wordSearch, setWordSearch] = useState<WordSearchGrid | null>(null);
  const [sudoku, setSudoku] = useState<SudokuGrid | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const generatePuzzle = useCallback(async () => {
    setIsGenerating(true);
    
    // Clear previous results
    setCrossword(null);
    setWordSearch(null);
    setSudoku(null);
    
    try {
      let result: GenerationResult;
      
      if (config.gameType === 'crossword') {
        const generator = new CrosswordGenerator(config);
        result = await generator.generateCrossword();
        
        if (result.success && result.crossword) {
          setCrossword(result.crossword);
          toast({
            title: "Crossword Generated Successfully!",
            description: `Generated ${result.crossword.placedWords.length} words in the puzzle.`,
          });
        }
      } else if (config.gameType === 'wordsearch') {
        const generator = new WordSearchGenerator(config);
        result = await generator.generateWordSearch();
        
        if (result.success && result.wordSearch) {
          setWordSearch(result.wordSearch);
          toast({
            title: "Word Search Generated Successfully!",
            description: `Generated ${result.wordSearch.placedWords.length} words in the puzzle.`,
          });
        }
      } else {
        const generator = new SudokuGenerator(config);
        result = await generator.generateSudoku();
        
        if (result.success && result.sudoku) {
          setSudoku(result.sudoku);
          toast({
            title: "Sudoku Generated Successfully!",
            description: `Generated ${result.sudoku.difficulty} difficulty puzzle.`,
          });
        }
      }
      
      if (!result.success) {
        toast({
          title: "Generation Failed",
          description: result.error || `Could not generate ${config.gameType} with current settings.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during generation.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [config, toast]);

  const exportToPDF = async (includeAnswers: boolean = false) => {
    if (!crossword && !wordSearch && !sudoku) return;
    
    setIsExporting(true);
    
    try {
      const pdfGenerator = new PDFGenerator();
      let title: string;
      let pdfData: string;
      
      // Get theme names for PDF
      const themeNames = config.themes
        .map(themeId => AVAILABLE_THEMES.find(t => t.id === themeId)?.name)
        .filter(Boolean) as string[];
      
      const pdfConfig = {
        themes: themeNames,
        language: config.language,
        difficulty: config.difficulty
      };
      
      if (config.gameType === 'crossword' && crossword) {
        title = includeAnswers ? 'Crossword Answer Key' : 'Crossword Puzzle';
        pdfData = includeAnswers 
          ? await pdfGenerator.generateAnswerKeyPDF(crossword, title, pdfConfig)
          : await pdfGenerator.generatePuzzlePDF(crossword, title, pdfConfig);
      } else if (config.gameType === 'wordsearch' && wordSearch) {
        title = includeAnswers ? 'Word Search Answer Key' : 'Word Search Puzzle';
        pdfData = includeAnswers 
          ? await pdfGenerator.generateWordSearchAnswerKeyPDF(wordSearch, title, pdfConfig)
          : await pdfGenerator.generateWordSearchPuzzlePDF(wordSearch, title, pdfConfig);
      } else if (config.gameType === 'sudoku' && sudoku) {
        title = includeAnswers ? 'Sudoku Solution' : 'Sudoku Puzzle';
        pdfData = includeAnswers 
          ? await pdfGenerator.generateSudokuSolutionPDF(sudoku, title, pdfConfig)
          : await pdfGenerator.generateSudokuPuzzlePDF(sudoku, title, pdfConfig);
      } else {
        throw new Error('No puzzle data available for export');
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = pdfData;
      let fileName: string;
      switch (config.gameType) {
        case 'crossword':
          fileName = includeAnswers ? 'crossword-answer-key.pdf' : 'crossword-puzzle.pdf';
          break;
        case 'wordsearch':
          fileName = includeAnswers ? 'word-search-answer-key.pdf' : 'word-search-puzzle.pdf';
          break;
        case 'sudoku':
          fileName = includeAnswers ? 'sudoku-solution.pdf' : 'sudoku-puzzle.pdf';
          break;
        default:
          fileName = 'puzzle.pdf';
      }
      link.download = fileName;
      link.click();
      
      toast({
        title: "PDF Generated Successfully!",
        description: `Downloaded ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not generate PDF file.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedThemeNames = config.themes
    .map(themeId => AVAILABLE_THEMES.find(t => t.id === themeId)?.name)
    .filter(Boolean)
    .join(', ');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <img 
            src="/logos/logo-wide.png" 
            alt="Ebrandi Crossword Generator Logo" 
            className="h-12 w-auto object-contain"
          />
          <h1 className="text-4xl font-bold text-gray-900">
            {config.gameType === 'crossword' ? 'Crossword Generator' : 
             config.gameType === 'wordsearch' ? 'Word Search Generator' : 'Sudoku Generator'}
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {config.gameType === 'crossword' 
            ? 'Create professional crossword puzzles for your kids'
            : config.gameType === 'wordsearch'
            ? 'Create engaging word search puzzles for educational fun'
            : 'Create challenging Sudoku puzzles with multiple difficulty levels'
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Puzzle Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ConfigurationPanel 
                config={config} 
                onConfigChange={setConfig} 
              />
              
              <Separator />
              
              {/* Current Settings Summary */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Current Settings:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Game Type: {config.gameType === 'crossword' ? 'Crossword' : 
                                   config.gameType === 'wordsearch' ? 'Word Search' : 'Sudoku'}</div>
                  {config.gameType !== 'sudoku' && (
                    <div>Language: {AVAILABLE_LANGUAGES.find(l => l.id === config.language)?.name || config.language}</div>
                  )}
                  <div>Grid Size: {config.gameType === 'sudoku' ? '9×9 (Standard Sudoku)' : `${config.gridSize}×${config.gridSize}`}</div>
                  {config.gameType !== 'sudoku' && (
                    <div>Target Words: {config.wordCount}</div>
                  )}
                  <div>Difficulty: {config.gameType === 'sudoku' ? 
                    (['Easy', 'Medium', 'Hard', 'Expert'][config.difficulty - 1] || 'Easy') :
                    `${config.difficulty}/3`}</div>
                  {config.gameType !== 'sudoku' && (
                    <div>
                      <div className="mb-1">Themes:</div>
                      <div className="flex flex-wrap gap-1">
                        {config.themes.map(themeId => {
                          const theme = AVAILABLE_THEMES.find(t => t.id === themeId);
                          return theme ? (
                            <Badge key={themeId} variant="secondary" className="text-xs">
                              {theme.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Generate Button */}
              <Button 
                onClick={generatePuzzle}
                disabled={isGenerating || (config.gameType !== 'sudoku' && config.themes.length === 0)}
                className="w-full py-3"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Puzzle className="w-4 h-4 mr-2" />
                    {config.gameType === 'crossword' ? 'Generate Crossword' : 
                     config.gameType === 'wordsearch' ? 'Generate Word Search' : 'Generate Sudoku'}
                  </>
                )}
              </Button>
              
              {/* Export Buttons */}
              <AnimatePresence>
                {(crossword || wordSearch || sudoku) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Button 
                      variant="outline" 
                      onClick={() => exportToPDF(false)}
                      disabled={isExporting}
                      className="w-full"
                    >
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4 mr-2" />
                      )}
                      {config.gameType === 'sudoku' ? 'Export Puzzle' : 'Export Empty Puzzle'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => exportToPDF(true)}
                      disabled={isExporting}
                      className="w-full"
                    >
                      {isExporting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4 mr-2" />
                      )}
                      {config.gameType === 'sudoku' ? 'Export Solution' : 'Export Answer Key'}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={generatePuzzle}
                      disabled={isGenerating}
                      className="w-full"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Crossword Display */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <AnimatePresence mode="wait">
            {crossword ? (
              <CrosswordDisplay crossword={crossword} />
            ) : wordSearch ? (
              <WordSearchDisplay wordSearch={wordSearch} />
            ) : sudoku ? (
              <SudokuDisplay sudoku={sudoku} />
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Ready to Generate
                    </h3>
                    <p className="text-gray-500">
                      Configure your puzzle settings and click "{config.gameType === 'crossword' ? 'Generate Crossword' : 
                       config.gameType === 'wordsearch' ? 'Generate Word Search' : 'Generate Sudoku'}" to begin
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
