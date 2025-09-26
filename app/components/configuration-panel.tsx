
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CrosswordConfig, AVAILABLE_THEMES, AVAILABLE_LANGUAGES, ThemeId, LanguageId, GameType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Grid3X3, 
  Hash, 
  Target, 
  BookOpen,
  Zap,
  CheckCircle2,
  Circle,
  Globe,
  Puzzle,
  Calculator
} from 'lucide-react';

interface ConfigurationPanelProps {
  config: CrosswordConfig;
  onConfigChange: (config: CrosswordConfig) => void;
}

export default function ConfigurationPanel({ config, onConfigChange }: ConfigurationPanelProps) {
  const updateConfig = (updates: Partial<CrosswordConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const toggleTheme = (themeId: ThemeId) => {
    const currentThemes = config.themes;
    const newThemes = currentThemes.includes(themeId)
      ? currentThemes.filter(t => t !== themeId)
      : [...currentThemes, themeId];
    
    updateConfig({ themes: newThemes });
  };

  const getDifficultyLabel = (level: number): string => {
    if (config.gameType === 'sudoku') {
      switch (level) {
        case 1: return 'Easy';
        case 2: return 'Easy';
        case 3: return 'Medium';
        case 4: return 'Hard';
        case 5: return 'Expert';
        default: return 'Medium';
      }
    }
    
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Very Hard';
      case 5: return 'Expert';
      default: return 'Medium';
    }
  };

  const getDifficultyColor = (level: number): string => {
    switch (level) {
      case 1: return 'text-green-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-orange-600';
      case 4: return 'text-red-600';
      case 5: return 'text-purple-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Puzzle className="w-4 h-4 text-blue-600" />
          <Label className="text-sm font-semibold">Game Type</Label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={config.gameType === 'crossword' ? "default" : "outline"}
            size="sm"
            onClick={() => updateConfig({ gameType: 'crossword' })}
            className="flex items-center gap-2 h-10"
          >
            <Grid3X3 className="w-4 h-4" />
            Crossword
          </Button>
          <Button
            variant={config.gameType === 'wordsearch' ? "default" : "outline"}
            size="sm"
            onClick={() => updateConfig({ gameType: 'wordsearch' })}
            className="flex items-center gap-2 h-10"
          >
            <Target className="w-4 h-4" />
            Word Search
          </Button>
          <Button
            variant={config.gameType === 'sudoku' ? "default" : "outline"}
            size="sm"
            onClick={() => updateConfig({ gameType: 'sudoku', gridSize: 9, wordCount: 1 })}
            className="flex items-center gap-2 h-10"
          >
            <Calculator className="w-4 h-4" />
            Sudoku
          </Button>
        </div>
      </motion.div>

      {/* Language Selection - Only for word-based games */}
      {config.gameType !== 'sudoku' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-indigo-600" />
          <Label className="text-sm font-semibold">Language</Label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {AVAILABLE_LANGUAGES.map((language) => (
            <Button
              key={language.id}
              variant={config.language === language.id ? "default" : "outline"}
              size="sm"
              onClick={() => updateConfig({ language: language.id })}
              className="flex items-center gap-2 text-xs h-8 min-w-0"
            >
              <div className="relative w-6 h-4 flex-shrink-0">
                <Image
                  src={language.flag}
                  alt={`${language.name} flag`}
                  fill
                  className="object-cover rounded-sm"
                  sizes="24px"
                />
              </div>
              <span className="truncate font-medium">{language.name}</span>
            </Button>
          ))}
        </div>
        </motion.div>
      )}

      {/* Grid Size - Configurable for crossword/wordsearch, fixed for Sudoku */}
      {config.gameType !== 'sudoku' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
        <div className="flex items-center gap-2 mb-3">
          <Grid3X3 className="w-4 h-4 text-blue-600" />
          <Label className="text-sm font-semibold">Grid Size: {config.gridSize}×{config.gridSize}</Label>
        </div>
        <Slider
          value={[config.gridSize]}
          onValueChange={([value]) => updateConfig({ gridSize: value })}
          min={10}
          max={21}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10×10 (Small)</span>
          <span>21×21 (Large)</span>
        </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Grid3X3 className="w-4 h-4 text-blue-600" />
            <Label className="text-sm font-semibold">Grid Size: 9×9 (Standard Sudoku)</Label>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">Sudoku puzzles use a fixed 9×9 grid divided into nine 3×3 boxes.</p>
          </div>
        </motion.div>
      )}

      {/* Word Count - Only for word-based games */}
      {config.gameType !== 'sudoku' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-4 h-4 text-green-600" />
          <Label className="text-sm font-semibold">Target Words: {config.wordCount}</Label>
        </div>
        <Slider
          value={[config.wordCount]}
          onValueChange={([value]) => updateConfig({ wordCount: value })}
          min={8}
          max={30}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>8 (Simple)</span>
          <span>30 (Complex)</span>
        </div>
        </motion.div>
      )}

      {/* Difficulty Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-purple-600" />
          <Label className="text-sm font-semibold">
            Difficulty: <span className={getDifficultyColor(config.difficulty)}>
              {getDifficultyLabel(config.difficulty)}
            </span>
          </Label>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <Button
              key={level}
              variant={config.difficulty === level ? "default" : "outline"}
              size="sm"
              onClick={() => updateConfig({ difficulty: level })}
              className="text-xs px-2"
            >
              {getDifficultyLabel(level)}
            </Button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {config.gameType === 'sudoku' ? (
            <>
              {config.difficulty === 1 && "Very easy puzzles with many given numbers"}
              {config.difficulty === 2 && "Easy puzzles, good for beginners"}
              {config.difficulty === 3 && "Medium difficulty with moderate challenge"}
              {config.difficulty === 4 && "Hard puzzles requiring advanced techniques"}
              {config.difficulty === 5 && "Expert level, very few given numbers"}
            </>
          ) : (
            <>
              {config.difficulty === 1 && "Simple vocabulary, common words"}
              {config.difficulty === 2 && "Moderate vocabulary, mixed complexity"}
              {config.difficulty === 3 && "Advanced vocabulary, challenging words"}
              {config.difficulty === 4 && "Complex vocabulary, difficult terms"}
              {config.difficulty === 5 && "Expert level, specialized terminology"}
            </>
          )}
        </p>
      </motion.div>

      {/* Theme Selection - Only for word-based games */}
      {config.gameType !== 'sudoku' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-orange-600" />
          <Label className="text-sm font-semibold">
            Educational Themes ({config.themes.length} selected)
          </Label>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {AVAILABLE_THEMES.map((theme) => (
            <motion.div
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-200 ${
                  config.themes.includes(theme.id) 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => toggleTheme(theme.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {config.themes.includes(theme.id) ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {theme.name}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {config.themes.length === 0 && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            Please select at least one theme to generate a crossword puzzle.
          </p>
        )}
        </motion.div>
      )}

      {/* Quick Theme Selection - Only for word-based games */}
      {config.gameType !== 'sudoku' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="space-y-2"
      >
        <Label className="text-sm font-semibold">Quick Select:</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConfig({ themes: ['general-knowledge', 'science-nature', 'history-geography'] })}
          >
            Core Subjects
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConfig({ themes: ['literature', 'arts-culture', 'technology'] })}
          >
            Arts & Tech
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConfig({ themes: ['sports', 'animals', 'health'] })}
          >
            Life & Nature
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateConfig({ themes: AVAILABLE_THEMES.map(t => t.id) })}
          >
            Select All
          </Button>
        </div>
        </motion.div>
      )}
    </div>
  );
}
