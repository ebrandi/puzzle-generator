
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WordSearchGrid } from '@/lib/types';
import { Grid3X3, Search, List, Eye, EyeOff } from 'lucide-react';
import WordSearchAnswerDisplay from './word-search-answer-display';

interface WordSearchDisplayProps {
  wordSearch: WordSearchGrid;
}

export default function WordSearchDisplay({ wordSearch }: WordSearchDisplayProps) {
  const { grid, placedWords, wordList } = wordSearch;
  const [showAnswers, setShowAnswers] = useState(false);

  // If showing answers, use the answer display component
  if (showAnswers) {
    return (
      <div className="space-y-6">
        {/* Answer Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Viewing answer key with highlighted solutions
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswers(false)}
                className="gap-2"
              >
                <EyeOff className="w-4 h-4" />
                Hide Answers
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <WordSearchAnswerDisplay wordSearch={wordSearch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Puzzle Overview with Answer Toggle */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Puzzle Overview</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Grid3X3 className="w-3 h-3" />
                {grid.length}×{grid.length}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <List className="w-3 h-3" />
                {wordList.length} words
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Find all the words hidden in the grid
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnswers(true)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Show Answers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Word Search Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-600" />
            Word Search Grid
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
                row.map((letter, colIndex) => (
                  <motion.div
                    key={`${rowIndex}-${colIndex}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: (rowIndex + colIndex) * 0.01,
                      duration: 0.2 
                    }}
                    className="aspect-square flex items-center justify-center border border-gray-200 bg-white font-mono font-bold text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer"
                    style={{
                      width: `${Math.max(20, Math.min(32, 240 / grid.length))}px`,
                      height: `${Math.max(20, Math.min(32, 240 / grid.length))}px`,
                    }}
                  >
                    {letter}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Word List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5 text-green-600" />
            Words to Find ({wordList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {wordList.map((word, index) => (
              <motion.div
                key={word}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Badge 
                  variant="outline" 
                  className="w-full justify-center py-2 text-sm font-medium bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {word.toUpperCase()}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>


    </div>
  );
}
