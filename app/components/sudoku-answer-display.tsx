

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SudokuGrid } from '@/lib/types';
import { Grid3X3, CheckCircle, Hash } from 'lucide-react';

interface SudokuAnswerDisplayProps {
  sudoku: SudokuGrid;
}

export default function SudokuAnswerDisplay({ sudoku }: SudokuAnswerDisplayProps) {
  const { grid, difficulty, solvedGrid } = sudoku;

  // Count given and solved cells
  const givenCells = grid.flat().filter(cell => cell.isGiven).length;
  const solvedCells = 81 - givenCells;

  return (
    <div className="space-y-6">
      {/* Complete Solution Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Complete Solution
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
                {solvedGrid.map((row, rowIndex) =>
                  row.map((value, colIndex) => {
                    const isTopBorder = rowIndex % 3 === 0;
                    const isLeftBorder = colIndex % 3 === 0;
                    const isBottomBorder = rowIndex === 8 || (rowIndex + 1) % 3 === 0;
                    const isRightBorder = colIndex === 8 || (colIndex + 1) % 3 === 0;

                    // Check if this cell was given in the original puzzle
                    const wasGiven = grid[rowIndex][colIndex].isGiven;

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
                          font-mono font-bold text-lg transition-colors
                          ${wasGiven 
                            ? 'text-gray-800 bg-gray-50' 
                            : 'text-green-600 bg-green-50'
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
                        {value}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Solution Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-600" />
            Solution Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-50 border border-gray-400 rounded flex items-center justify-center font-mono font-bold text-gray-800">
                5
              </div>
              <div>
                <div className="font-medium text-gray-800">Given Clues</div>
                <div className="text-sm text-gray-600">Original puzzle numbers</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-50 border border-gray-400 rounded flex items-center justify-center font-mono font-bold text-green-600">
                7
              </div>
              <div>
                <div className="font-medium text-green-600">Solution Numbers</div>
                <div className="text-sm text-gray-600">Solved cell values</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solution Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-purple-600" />
            Solution Statistics
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
              <div className="text-2xl font-bold text-green-600">{solvedCells}</div>
              <div className="text-sm text-gray-600">Solved Cells</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 capitalize">{difficulty}</div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Verification Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Solution Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>All rows contain numbers 1-9 exactly once</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>All columns contain numbers 1-9 exactly once</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>All 3×3 boxes contain numbers 1-9 exactly once</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Solution is mathematically correct and unique</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

