
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrosswordGrid } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowDown, 
  Info,
  Grid3X3,
  Hash
} from 'lucide-react';

interface CrosswordDisplayProps {
  crossword: CrosswordGrid;
}

export default function CrosswordDisplay({ crossword }: CrosswordDisplayProps) {
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);

  // Create number map for grid positions
  const numberMap: { [key: string]: number } = {};
  crossword.placedWords.forEach(word => {
    const key = `${word.startRow}-${word.startCol}`;
    if (!numberMap[key] || numberMap[key] > word.number) {
      numberMap[key] = word.number;
    }
  });

  const gridSize = crossword.grid.length;
  const cellSize = Math.min(600 / gridSize, 40);
  
  const handleWordClick = (wordNumber: number) => {
    setSelectedWord(selectedWord === wordNumber ? null : wordNumber);
  };

  const getWordPath = (word: any) => {
    const cells = [];
    for (let i = 0; i < word.length; i++) {
      if (word.direction === 'horizontal') {
        cells.push([word.startRow, word.startCol + i]);
      } else {
        cells.push([word.startRow + i, word.startCol]);
      }
    }
    return cells;
  };

  const isWordHighlighted = (row: number, col: number) => {
    if (selectedWord === null) return false;
    
    const word = crossword.placedWords.find(w => w.number === selectedWord);
    if (!word) return false;
    
    const wordPath = getWordPath(word);
    return wordPath.some(([r, c]) => r === row && c === col);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Puzzle Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Puzzle Overview</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Grid3X3 className="w-3 h-3" />
                {gridSize}×{gridSize}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {crossword.placedWords.length} words
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Click on numbered clues to highlight words in the grid
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnswers(!showAnswers)}
              className="gap-2"
            >
              {showAnswers ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Answers
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Answers
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Grid First, then Clues Below */}
      <div className="space-y-6">
        {/* Crossword Grid - Full Width */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <motion.div
                className="inline-block border border-gray-300 rounded-lg overflow-hidden shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div 
                  className="grid gap-0 bg-white"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
                  }}
                >
                  {crossword.grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const hasLetter = cell !== '';
                      const key = `${rowIndex}-${colIndex}`;
                      const number = numberMap[key];
                      const isHighlighted = isWordHighlighted(rowIndex, colIndex);

                      return (
                        <motion.div
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            relative border border-gray-300 text-center font-bold text-sm
                            ${hasLetter 
                              ? (isHighlighted 
                                ? 'bg-blue-200 border-blue-400' 
                                : 'bg-white') 
                              : 'bg-gray-300'
                            }
                          `}
                          style={{
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                            fontSize: `${Math.max(10, cellSize * 0.25)}px`
                          }}
                          whileHover={hasLetter ? { scale: 1.05 } : {}}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          {hasLetter ? (
                            <>
                              {number && (
                                <div 
                                  className="absolute top-0 left-0 text-xs font-bold text-gray-700"
                                  style={{ fontSize: `${Math.max(6, cellSize * 0.15)}px` }}
                                >
                                  {number}
                                </div>
                              )}
                              {showAnswers && (
                                <div 
                                  className="flex items-center justify-center h-full text-gray-900"
                                  style={{ paddingTop: number ? `${cellSize * 0.1}px` : '0' }}
                                >
                                  {cell}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              {/* Empty gray cell - no content */}
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Clues - Below the Grid in Two Columns */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5" />
              Clues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Across Clues */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Across ({crossword.clues.across.length})</h3>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {crossword.clues.across.map((clue, index) => (
                      <motion.div
                        key={clue.number}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`
                          p-3 rounded border cursor-pointer transition-all duration-200
                          ${selectedWord === clue.number 
                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                        onClick={() => handleWordClick(clue.number)}
                      >
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-0.5 text-xs">
                            {clue.number}
                          </Badge>
                          <p className="text-sm flex-1 leading-relaxed">
                            {clue.clue}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Down Clues */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ArrowDown className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Down ({crossword.clues.down.length})</h3>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {crossword.clues.down.map((clue, index) => (
                      <motion.div
                        key={clue.number}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`
                          p-3 rounded border cursor-pointer transition-all duration-200
                          ${selectedWord === clue.number 
                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                        onClick={() => handleWordClick(clue.number)}
                      >
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-0.5 text-xs">
                            {clue.number}
                          </Badge>
                          <p className="text-sm flex-1 leading-relaxed">
                            {clue.clue}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
