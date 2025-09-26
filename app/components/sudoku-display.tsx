

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SudokuGrid } from '@/lib/types';
import { Grid3X3, Eye, EyeOff, Hash } from 'lucide-react';
import SudokuAnswerDisplay from './sudoku-answer-display';

interface SudokuDisplayProps {
  sudoku: SudokuGrid;
}

export default function SudokuDisplay({ sudoku }: SudokuDisplayProps) {
  const { grid, difficulty, solvedGrid } = sudoku;
  const [showAnswers, setShowAnswers] = useState(false);

  // Count given and empty cells
  const givenCells = grid.flat().filter(cell => cell.isGiven).length;
  const emptyCells = 81 - givenCells;

  // If showing answers, use the answer display component
  if (showAnswers) {
    return (
      <div className="space-y-6">
        {/* Answer Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Viewing complete solution
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswers(false)}
                className="gap-2"
              >
                <EyeOff className="w-4 h-4" />
                Hide Solution
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <SudokuAnswerDisplay sudoku={sudoku} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Puzzle Overview with Solution Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Sudoku Puzzle</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 capitalize">
                <Grid3X3 className="w-3 h-3" />
                {difficulty}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {givenCells} clues
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Fill in the empty cells with numbers 1-9
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnswers(true)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Show Solution
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sudoku Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-600" />
            9×9 Grid
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="grid grid-cols-9 gap-0 border-2 border-gray-800">
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isTopBorder = rowIndex % 3 === 0;
                    const isLeftBorder = colIndex % 3 === 0;
                    const isBottomBorder = rowIndex === 8 || (rowIndex + 1) % 3 === 0;
                    const isRightBorder = colIndex === 8 || (colIndex + 1) % 3 === 0;

                    return (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          delay: (rowIndex * 9 + colIndex) * 0.005,
                          duration: 0.2 
                        }}
                        className={`
                          aspect-square flex items-center justify-center 
                          font-mono font-bold text-lg
                          bg-white hover:bg-blue-50 transition-colors cursor-pointer
                          ${cell.isGiven 
                            ? 'text-gray-800 bg-gray-50' 
                            : 'text-blue-600 bg-white'
                          }
                          ${isTopBorder ? 'border-t-2' : 'border-t'}
                          ${isLeftBorder ? 'border-l-2' : 'border-l'}
                          ${isBottomBorder ? 'border-b-2' : 'border-b'}
                          ${isRightBorder ? 'border-r-2' : 'border-r'}
                          border-gray-400
                        `}
                        style={{
                          width: '36px',
                          height: '36px',
                        }}
                      >
                        {cell.value !== 0 ? cell.value : ''}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Rules and Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-green-600" />
            How to Solve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <p>Fill each row with numbers 1-9 (no repeats)</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <p>Fill each column with numbers 1-9 (no repeats)</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <p>Fill each 3×3 box with numbers 1-9 (no repeats)</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <p>Use logic and elimination to find the unique solution</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Puzzle Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-purple-600" />
            Puzzle Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{givenCells}</div>
              <div className="text-sm text-gray-600">Given Clues</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{emptyCells}</div>
              <div className="text-sm text-gray-600">Empty Cells</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 capitalize">{difficulty}</div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">9×9</div>
              <div className="text-sm text-gray-600">Grid Size</div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

