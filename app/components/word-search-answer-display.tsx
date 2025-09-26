

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WordSearchGrid } from '@/lib/types';
import { Grid3X3, List } from 'lucide-react';

interface WordSearchAnswerDisplayProps {
  wordSearch: WordSearchGrid;
}

export default function WordSearchAnswerDisplay({ wordSearch }: WordSearchAnswerDisplayProps) {
  const { grid, placedWords, wordList } = wordSearch;

  // Create a map of highlighted positions
  const getHighlightedPositions = (): Set<string> => {
    const positions = new Set<string>();
    
    placedWords.forEach(placedWord => {
      const wordPositions = getWordSearchPositions(placedWord, grid.length);
      wordPositions.forEach(pos => {
        positions.add(`${pos.row}-${pos.col}`);
      });
    });
    
    return positions;
  };

  const getWordSearchPositions = (placedWord: any, gridSize: number): { row: number; col: number }[] => {
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
  };

  const highlightedPositions = getHighlightedPositions();

  return (
    <div className="space-y-6">
      {/* Word Search Answer Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-600" />
            Word Search Answer Key
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div 
              className="grid gap-1 p-4 bg-white rounded-lg shadow-sm border"
              style={{ 
                gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
                fontSize: `${Math.max(8, Math.min(16, 240 / grid.length))}px`,
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => {
                  const isHighlighted = highlightedPositions.has(`${rowIndex}-${colIndex}`);
                  
                  return (
                    <motion.div
                      key={`${rowIndex}-${colIndex}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: (rowIndex + colIndex) * 0.01,
                        duration: 0.2 
                      }}
                      className={`aspect-square flex items-center justify-center border border-gray-200 font-mono font-bold transition-colors ${
                        isHighlighted 
                          ? 'bg-gray-200 text-gray-800' 
                          : 'bg-white text-gray-400'
                      }`}
                      style={{
                        width: `${Math.max(20, Math.min(32, 240 / grid.length))}px`,
                        height: `${Math.max(20, Math.min(32, 240 / grid.length))}px`,
                      }}
                    >
                      {letter}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Word List with Directions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5 text-green-600" />
            Found Words ({wordList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {placedWords.map((placedWord, index) => (
              <motion.div
                key={`${placedWord.word}-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-white">
                    {placedWord.word.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-600 capitalize">
                    {placedWord.direction.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Row {placedWord.startRow + 1}, Col {placedWord.startCol + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>

      {/* Direction Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-purple-600" />
            Direction Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {['horizontal', 'vertical', 'diagonal', 'reverse-horizontal', 'reverse-vertical', 'reverse-diagonal'].map(direction => {
              const count = placedWords.filter(w => w.direction === direction).length;
              if (count === 0) return null;
              
              return (
                <div key={direction} className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{direction.replace('-', ' ')}</div>
                </div>
              );
            })}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

