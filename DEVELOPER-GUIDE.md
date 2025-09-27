
# 🛠 Ebrandi Puzzle Generator - Developer Guide

<div align="center">
  <img src="app/public/logos/logo-wide.png" alt="Ebrandi Puzzle Generator Logo" width="400">
</div>

<div align="center">
  <strong>Comprehensive Developer Documentation</strong>
</div>



This guide provides detailed technical information for developers who want to understand, modify, extend, or contribute to the Ebrandi Puzzle Generator project.

## 📖 Table of Contents
- [Technology Stack](#technology-stack)
- [Detailed Features](#detailed-features)
- [Project Structure](#project-structure)
- [Core Architecture](#core-architecture)
- [Word Database System](#word-database-system)
- [Extending the Application](#extending-the-application)
- [Adding Words and Categories](#adding-words-and-categories)
- [Adding New Languages](#adding-new-languages)
- [Branding & Design](#branding--design)
- [Contributing Guidelines](#contributing-guidelines)
- [Development Workflows](#development-workflows)
- [Testing](#testing)
- [License](#license)
- [Developer Support](#developer-support)

## 🛠 Technology Stack

### Core Framework
- **Next.js 14**: React-based web framework with App Router
- **React 18**: Modern React with concurrent features
- **TypeScript**: Type-safe JavaScript for better development experience

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library for smooth interactions
- **Lucide React**: Modern icon library

### Game Logic & Algorithms
- **Custom Crossword Algorithm**: Advanced word placement with backtracking
- **Word Search Generator**: Multi-directional word placement algorithm
- **Sudoku Generator**: Mathematical puzzle generation with unique solutions
- **PDF Generation**: jsPDF for high-quality document export

### Development Tools
- **Yarn**: Package manager and monorepo tool
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **PostCSS**: CSS processing and optimization

### Deployment & Infrastructure
- **Static Export Compatible**: Can be deployed anywhere
- **Systemd Integration**: Linux service management
- **Nginx Support**: Reverse proxy configuration
- **Let's Encrypt**: Automatic SSL certificate management

## ✨ Detailed Features

### 🎮 Crossword Puzzles
- **Advanced Placement Algorithm**: Sophisticated word intersection logic
- **Theme-Based Generation**: Words selected from categorized databases
- **Multilingual Support**: Full internationalization for clues and words
- **Difficulty Scaling**: Algorithmic difficulty adjustment
- **Grid Optimization**: Automatic grid size adjustment for word fitting
- **Interactive Preview**: Real-time crossword visualization
- **Professional PDF Export**: Print-ready layouts with answer keys

### 🔍 Word Search Games
- **Multi-Directional Placement**: Horizontal, vertical, and diagonal word placement
- **Reverse Word Support**: Words can be placed backwards
- **Theme Integration**: Category-based word selection
- **Variable Grid Sizes**: 10x10 to 21x21 customizable grids
- **Letter Filling**: Random letters fill empty spaces
- **Solution Highlighting**: Answer keys with word locations
- **PDF Export**: Clean puzzle and solution documents

### 🔢 Sudoku Puzzles
- **Mathematical Generation**: Algorithm ensures unique solutions
- **Difficulty Levels**: Easy to Expert with appropriate clue counts
- **Solution Validation**: Automatic checking for puzzle validity
- **Interactive Grid**: Click-to-fill interface for testing
- **Hint System**: Built-in solving assistance
- **PDF Export**: Professional number grid layouts

### 🌍 Internationalization
- **Multi-Language Word Databases**: 1950+ words across three languages
- **Localized UI**: Interface elements translated
- **Cultural Adaptation**: Theme categories adapted for different regions
- **Flag Integration**: Visual language selection
- **RTL Support Ready**: Architecture supports right-to-left languages

### 📄 PDF Generation System
- **Multi-Format Export**: Supports all three puzzle types
- **Professional Layouts**: Classroom-ready formatting
- **Answer Key Generation**: Separate solution documents
- **Branding Integration**: Logo and header customization
- **Print Optimization**: High-quality output for physical printing

## 📁 Project Structure

```
puzzle-generator/
├── app/                                 # Next.js application root
│   ├── app/                            # App Router directory
│   │   ├── layout.tsx                  # Root layout with providers
│   │   ├── page.tsx                    # Main application page
│   │   └── globals.css                 # Global CSS styles
│   ├── components/                     # React components
│   │   ├── ui/                        # Radix UI base components
│   │   │   ├── button.tsx             # Button component
│   │   │   ├── card.tsx               # Card layouts
│   │   │   ├── select.tsx             # Dropdown selections
│   │   │   ├── slider.tsx             # Range inputs
│   │   │   └── [other-ui-components]   # Additional UI primitives
│   │   ├── crossword-display.tsx       # Interactive crossword grid
│   │   ├── word-search-display.tsx     # Word search visualization
│   │   ├── word-search-answer-display.tsx # Word search solutions
│   │   ├── sudoku-display.tsx          # Interactive Sudoku grid
│   │   ├── sudoku-answer-display.tsx   # Sudoku solutions
│   │   ├── crossword-generator-app.tsx # Main app orchestrator
│   │   ├── configuration-panel.tsx     # Settings interface
│   │   └── theme-provider.tsx          # Dark/light mode provider
│   ├── lib/                           # Core business logic
│   │   ├── crossword-generator.ts      # Crossword algorithm
│   │   ├── word-search-generator.ts    # Word search algorithm
│   │   ├── sudoku-generator.ts         # Sudoku generation
│   │   ├── pdf-generator.ts           # Multi-format PDF export
│   │   ├── word-database.ts           # Word loading utilities
│   │   ├── types.ts                   # TypeScript definitions
│   │   └── utils.ts                   # Shared utilities
│   ├── hooks/                         # Custom React hooks
│   │   └── use-toast.ts              # Toast notification hook
│   ├── public/                        # Static assets
│   │   ├── data/                     # Word databases
│   │   │   ├── en/                   # English word lists
│   │   │   │   ├── animals.txt       # Animal words with clues
│   │   │   │   ├── science-nature.txt # Science & nature words
│   │   │   │   ├── general-knowledge.txt # General knowledge
│   │   │   │   ├── arts-culture.txt   # Arts & culture
│   │   │   │   ├── sports.txt         # Sports terminology
│   │   │   │   ├── technology.txt     # Technology terms
│   │   │   │   ├── history-geography.txt # History & geography
│   │   │   │   ├── literature.txt     # Literature & language
│   │   │   │   ├── mathematics.txt    # Mathematics terms
│   │   │   │   ├── health.txt         # Health & medicine
│   │   │   │   ├── entertainment.txt  # Entertainment & media
│   │   │   │   ├── food-cooking.txt   # Food & cooking
│   │   │   │   └── travel-places.txt  # Travel & places
│   │   │   ├── pt/                   # Portuguese word lists
│   │   │   │   └── [same-structure]   # Mirror of English structure
│   │   │   └── es/                   # Spanish word lists
│   │   │       └── [same-structure]   # Mirror of English structure
│   │   ├── logos/                    # Branding assets
│   │   │   ├── logo-wide.png         # Horizontal logo (400x200)
│   │   │   ├── logo-square.png       # Square logo (200x200)
│   │   │   └── logo-square-alt.png   # Alternative square logo
│   │   └── flags/                    # Language flag images
│   │       ├── us-flag.png          # English flag
│   │       ├── br-flag.png          # Portuguese flag
│   │       └── es-flag.png          # Spanish flag
│   ├── package.json                  # Dependencies and scripts
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── postcss.config.js           # PostCSS configuration
│   └── components.json             # shadcn/ui configuration
├── deploy.sh                        # Automated deployment script
├── manage.sh                        # Service management script
├── README.md                        # Installation and usage guide
├── DEVELOPER-GUIDE.md              # This technical documentation
├── .gitignore                      # Git ignore patterns
└── LICENSE                         # MIT license file
```

## 🏗 Core Architecture

### Component Hierarchy

```
CrosswordGeneratorApp (main)
├── ConfigurationPanel
│   ├── GameTypeSelector
│   ├── LanguageSelector (Crossword/Word Search only)
│   ├── ThemeSelector (Crossword/Word Search only)
│   ├── GridSizeSlider
│   ├── WordCountSlider (Crossword/Word Search only)
│   ├── DifficultySelector
│   └── GenerateButton
├── PuzzleDisplay (conditional)
│   ├── CrosswordDisplay (if crossword)
│   ├── WordSearchDisplay (if word search)
│   └── SudokuDisplay (if sudoku)
├── ExportPanel
│   ├── PuzzlePDFButton
│   └── AnswerPDFButton
└── AnswerDisplay (conditional)
    ├── CrosswordAnswerDisplay
    ├── WordSearchAnswerDisplay
    └── SudokuAnswerDisplay
```

### Data Flow

```
User Input → ConfigurationPanel → Game Generator → Display Components → PDF Export
     ↓              ↓                    ↓              ↓               ↓
  Settings      Validation        Algorithm      Visualization      Documents
```

### Algorithm Overview

#### Crossword Generation
1. **Word Selection**: Choose words from theme databases based on difficulty
2. **Grid Initialization**: Create empty grid with specified dimensions
3. **Word Placement**: Use backtracking algorithm to place words with intersections
4. **Optimization**: Maximize word count and grid utilization
5. **Clue Assignment**: Match words with appropriate clues from database
6. **Validation**: Ensure puzzle is solvable and meets constraints

#### Word Search Generation
1. **Word Selection**: Pick words from chosen themes and difficulty
2. **Grid Setup**: Initialize grid with specified dimensions
3. **Word Placement**: Place words in 8 directions (including diagonals)
4. **Collision Detection**: Ensure words don't interfere with each other
5. **Fill Remaining**: Add random letters to empty cells
6. **Solution Tracking**: Record word positions for answer key

#### Sudoku Generation
1. **Grid Generation**: Create complete valid 9x9 Sudoku solution
2. **Clue Removal**: Remove numbers based on difficulty level
3. **Uniqueness Check**: Ensure puzzle has exactly one solution
4. **Difficulty Validation**: Verify puzzle meets selected difficulty criteria
5. **Presentation**: Format for display and PDF export

## 📊 Word Database System

### File Structure

Each language directory contains 13 theme files with consistent naming:

```
data/[language]/
├── animals.txt
├── arts-culture.txt
├── entertainment.txt
├── food-cooking.txt
├── general-knowledge.txt
├── health.txt
├── history-geography.txt
├── literature.txt
├── mathematics.txt
├── science-nature.txt
├── sports.txt
├── technology.txt
└── travel-places.txt
```

### Word Entry Format

Each line in the word files follows this strict format:
```
WORD|CLUE|DIFFICULTY_LEVEL
```

**Format Rules:**
- **WORD**: Uppercase, letters only, no spaces or special characters
- **CLUE**: Descriptive hint, under 60 characters recommended
- **DIFFICULTY_LEVEL**: Integer 1-3 (1=Easy, 2=Medium, 3=Hard)

**Example entries:**
```
DOG|Man's best friend|1
ELEPHANT|Largest land animal|2
RHINOCEROS|Large horned African mammal with thick skin|3
```

### Current Database Statistics

- **Total Words**: 1,950+ across all languages
- **Words per Category**: 50+ in each theme
- **Languages**: 3 (English, Portuguese, Spanish)
- **Categories**: 13 educational themes
- **Quality Standard**: Each word includes educational clue and difficulty rating

### Database Loading System

```typescript
// lib/word-database.ts
interface WordEntry {
  word: string;
  clue: string;
  difficulty: number;
}

class WordDatabase {
  private static cache: Map<string, WordEntry[]> = new Map();
  
  static async loadWords(language: string, theme: string): Promise<WordEntry[]> {
    const cacheKey = `${language}-${theme}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const response = await fetch(`/data/${language}/${theme}.txt`);
    const text = await response.text();
    const words = this.parseWordFile(text);
    
    this.cache.set(cacheKey, words);
    return words;
  }
  
  private static parseWordFile(content: string): WordEntry[] {
    return content.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => {
        const [word, clue, difficultyStr] = line.split('|');
        return {
          word: word.trim(),
          clue: clue.trim(),
          difficulty: parseInt(difficultyStr.trim())
        };
      })
      .filter(entry => entry.word && entry.clue && entry.difficulty);
  }
}
```

## 🔧 Extending the Application

### Adding New Game Types

To add a new puzzle type (e.g., Word Ladder):

1. **Create the Generator** (`lib/word-ladder-generator.ts`):
```typescript
export interface WordLadder {
  startWord: string;
  endWord: string;
  steps: string[];
  difficulty: number;
}

export class WordLadderGenerator {
  static generate(config: WordLadderConfig): WordLadder {
    // Implementation here
  }
}
```

2. **Create Display Component** (`components/word-ladder-display.tsx`):
```typescript
interface WordLadderDisplayProps {
  puzzle: WordLadder;
}

export function WordLadderDisplay({ puzzle }: WordLadderDisplayProps) {
  // Render the word ladder puzzle
}
```

3. **Add to Main Configuration** (`lib/types.ts`):
```typescript
export type GameType = 'crossword' | 'wordsearch' | 'sudoku' | 'wordladder';

export const GAME_TYPES = [
  { id: 'crossword', name: 'Crossword', icon: Grid3X3 },
  { id: 'wordsearch', name: 'Word Search', icon: Search },
  { id: 'sudoku', name: 'Sudoku', icon: Hash },
  { id: 'wordladder', name: 'Word Ladder', icon: ArrowUpDown }, // New
] as const;
```

4. **Integrate with PDF Export** (`lib/pdf-generator.ts`):
```typescript
export class PDFGenerator {
  // Add new method for word ladder PDF generation
  static generateWordLadderPDF(puzzle: WordLadder): void {
    // Implementation
  }
}
```

### Customizing UI Themes

The application uses Tailwind CSS with a design system. To customize:

1. **Update Tailwind Configuration** (`tailwind.config.ts`):
```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#your-color-50',
          500: '#your-color-500',
          900: '#your-color-900',
        }
      }
    }
  }
}
```

2. **Modify Component Styles**:
Update the styling in component files using Tailwind classes.

3. **Update Logo Assets**:
Replace files in `public/logos/` with your branding.

## 📝 Adding Words and Categories

### ✏️ Adding Words to Existing Categories

1. **Navigate to the appropriate file**:
```bash
app/public/data/{language}/{theme-name}.txt
```

2. **Add entries following the format**:
```
NEWWORD|Description of the new word|2
ANOTHERWORD|Another descriptive clue|1
COMPLEXWORD|A more challenging definition|3
```

3. **Guidelines for quality entries**:
   - **Words**: Use standard spelling, avoid abbreviations
   - **Clues**: Be specific but not ambiguous
   - **Difficulty Assessment**:
     - **Level 1 (Easy)**: 3-6 letters, common everyday words
     - **Level 2 (Medium)**: 5-10 letters, moderate vocabulary
     - **Level 3 (Hard)**: 7+ letters, specialized or advanced terms

### 🆕 Creating New Categories

1. **Create the word database files**:
```bash
# Create files for each supported language
touch app/public/data/en/your-theme-name.txt
touch app/public/data/pt/your-theme-name.txt  
touch app/public/data/es/your-theme-name.txt
```

2. **Add words to each file** following the format above

3. **Register the new theme** in `app/lib/types.ts`:
```typescript
export const AVAILABLE_THEMES = [
  // ... existing themes ...
  { 
    id: 'your-theme-name', 
    name: 'Your Theme Display Name', 
    description: 'Brief description of your theme category' 
  },
] as const;
```

4. **File naming conventions**:
   - Use lowercase letters only
   - Separate words with hyphens (kebab-case)
   - Be descriptive but concise
   - Examples: `space-astronomy.txt`, `world-religions.txt`, `board-games.txt`

### 📊 Quality Guidelines

**Word Selection Criteria:**
- Choose words that clearly fit the theme
- Avoid abbreviations and acronyms unless theme-appropriate
- Include a balanced mix of difficulty levels (60% easy, 30% medium, 10% hard)
- Test words in actual crosswords to ensure good intersections

**Clue Writing Best Practices:**
- Be specific enough to avoid multiple valid answers
- Use simple, clear language appropriate for educational use
- Avoid cultural references that don't translate well
- Keep clues under 60 characters when possible
- Use educational or informative descriptions

**Content Distribution:**
- **Minimum per category**: 50 words for basic functionality
- **Recommended**: 200+ words for good variety
- **Production standard**: 500+ words for comprehensive coverage

**Word Length Distribution:**
- **3-5 letters**: 40% (excellent for crossword intersections)
- **6-8 letters**: 35% (balanced difficulty and utility)
- **9-12 letters**: 20% (challenging but manageable)
- **13+ letters**: 5% (expert level, special cases)

## 🌍 Adding New Languages

### Step-by-Step Process

1. **Create the language directory**:
```bash
mkdir app/public/data/[language-code]
# Example: mkdir app/public/data/fr (for French)
```

2. **Copy theme structure** from an existing language:
```bash
cp app/public/data/en/*.txt app/public/data/[language-code]/
```

3. **Translate all words and clues** in the new files:
   - Maintain the same format: `WORD|CLUE|DIFFICULTY`
   - Ensure words use only letters (no accents in the WORD field for crossword compatibility)
   - Translate clues to be culturally appropriate and educational

4. **Add flag image**:
```bash
# Add a flag image (24x16 pixels recommended)
cp your-flag-image.png app/public/flags/[country-code]-flag.png
```

5. **Register the language** in `app/lib/types.ts`:
```typescript
export const AVAILABLE_LANGUAGES = [
  // ... existing languages ...
  { 
    id: '[language-code]', 
    name: 'Language Name (Native)', 
    flag: '/flags/[country-code]-flag.png' 
  },
] as const;

// Example for French:
// { 
//   id: 'fr', 
//   name: 'Français', 
//   flag: '/flags/fr-flag.png' 
// },
```

6. **Update UI translations** (optional):
   - Modify component text for the new language
   - Add language-specific formatting rules if needed

### Language-Specific Considerations

**Character Sets:**
- For crossword compatibility, use base Latin characters in WORD field
- Full character sets (including accents) can be used in CLUE field
- Consider how the language handles capitalization

**Cultural Adaptation:**
- Adapt themes to be culturally relevant
- Include region-specific terms where appropriate
- Consider different educational standards and curricula

**Text Direction:**
- Current system supports LTR (Left-to-Right) languages
- RTL support would require additional development

### Testing New Languages

1. **Build and test the application**:
```bash
cd app && yarn build
```

2. **Verify puzzle generation**:
   - Test crossword generation with new language
   - Test word search functionality
   - Verify PDF export works correctly

3. **Validate word database format**:
```bash
# Check for format errors in new language files
find app/public/data/[language-code]/ -name "*.txt" -exec grep -L "^[A-Z]*|.*|[123]$" {} \;
```

## 🎨 Branding & Design

### Logo System

The application includes a comprehensive logo system with multiple variations:

#### Logo Variations

| Logo Type | File | Dimensions | Best Use Cases |
|-----------|------|------------|----------------|
| **Wide Logo** | `logo-wide.png` | 400×200px | Website headers, documentation |
| **Square Logo** | `logo-square.png` | 200×200px | App icons, social media |

#### Usage Guidelines

**Web Headers:**
```html
<img src="/logos/logo-wide.png" alt="Ebrandi Puzzle Generator" class="h-12 w-auto">
```

**App Icons:**
```html
<img src="/logos/logo-square.png" alt="App Icon" class="w-8 h-8">
```

**PDF Headers:**
The PDF generator automatically uses `logo-wide.png` for document headers.

### Design System

#### Color Palette
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-900: #1e3a8a;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-500: #6b7280;
--gray-900: #111827;
```

#### Typography
- **Headings**: `font-bold text-gray-900`
- **Body Text**: `text-gray-600`
- **Labels**: `text-sm font-medium text-gray-700`

#### Component Patterns
- **Cards**: `bg-white rounded-lg shadow-sm border`
- **Buttons**: `bg-primary-500 hover:bg-primary-600 text-white rounded-md`
- **Inputs**: `border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500`

### Customizing Branding

1. **Replace Logo Files**:
   - Update files in `public/logos/` with your designs
   - Maintain aspect ratios and dimensions
   - Use PNG format with transparency

2. **Update Color Scheme**:
   - Modify `tailwind.config.ts` with your colors
   - Update CSS custom properties in `app/globals.css`

3. **Customize PDF Headers**:
   - Modify `lib/pdf-generator.ts` to use your branding
   - Adjust header layouts and styling

## 🤝 Contributing Guidelines

We welcome contributions from developers of all skill levels! Here's how to get involved:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**:
```bash
git clone https://github.com/your-username/puzzle-generator.git
cd puzzle-generator
```

3. **Create a feature branch**:
```bash
git checkout -b feature/amazing-new-feature
```

4. **Install dependencies**:
```bash
cd app && yarn install
```

### Development Workflow

1. **Start development server**:
```bash
yarn dev
```

2. **Make your changes**:
   - Follow TypeScript best practices
   - Use Tailwind CSS for styling
   - Maintain consistent code formatting
   - Add comments for complex algorithms

3. **Test your changes**:
   - Test all three game types
   - Verify PDF export functionality
   - Check responsive design
   - Test across different browsers

4. **Commit your changes**:
```bash
git add .
git commit -m 'feat: add amazing new feature'
```

5. **Push and create PR**:
```bash
git push origin feature/amazing-new-feature
```

### Contribution Types

#### 🐛 Bug Fixes
- Fix crossword generation edge cases
- Resolve PDF export issues
- Address responsive design problems
- Correct word database formatting

#### ✨ New Features
- Additional puzzle types
- Enhanced PDF layouts
- New language support
- UI/UX improvements

#### 📚 Content Contributions
- Add words to existing categories
- Create new theme categories
- Translate content to new languages
- Improve clue quality

#### 🧹 Code Quality
- Refactor algorithms for better performance
- Add TypeScript types
- Improve error handling
- Optimize bundle size

### Code Standards

#### TypeScript
```typescript
// Use explicit types
interface PuzzleConfig {
  gridSize: number;
  wordCount: number;
  difficulty: 1 | 2 | 3;
  themes: string[];
}

// Prefer const assertions
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
type Difficulty = typeof DIFFICULTIES[number];
```

#### React Components
```typescript
// Use proper prop interfaces
interface ComponentProps {
  puzzle: CrosswordPuzzle;
  onExport: () => void;
}

// Use proper default props and error handling
export function Component({ puzzle, onExport }: ComponentProps) {
  if (!puzzle) {
    return <div>Loading...</div>;
  }
  
  // Component implementation
}
```

#### CSS/Tailwind
```tsx
// Use semantic class combinations
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
  <span className="text-sm font-medium text-gray-700">Label</span>
  <button className="px-3 py-1 text-xs font-medium text-white bg-primary-500 rounded hover:bg-primary-600">
    Action
  </button>
</div>
```

### Testing Guidelines

#### Manual Testing Checklist
- [ ] All three game types generate correctly
- [ ] PDF export works for all formats
- [ ] Responsive design functions on mobile/tablet/desktop
- [ ] All language options work properly
- [ ] Theme selection affects word choice correctly
- [ ] Difficulty levels produce appropriate puzzles

#### Word Database Testing
- [ ] New words follow format: `WORD|CLUE|DIFFICULTY`
- [ ] Words contain only letters (A-Z)
- [ ] Clues are educational and appropriate
- [ ] Difficulty levels are accurately assigned
- [ ] No duplicate entries within categories

### Pull Request Guidelines

#### PR Title Format
- `feat: add new sudoku difficulty level`
- `fix: resolve crossword generation timeout`
- `docs: update installation instructions`
- `style: improve responsive design on mobile`

#### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Word database addition

## Testing
- [ ] Tested locally
- [ ] All game types work
- [ ] PDF export functions
- [ ] Responsive design verified

## Screenshots
Include screenshots for UI changes

## Additional Notes
Any additional context or considerations
```

## 🔄 Development Workflows

### Setting Up Development Environment

1. **System Requirements**:
   - Node.js 18+ 
   - Yarn 1.22+
   - Git
   - Modern code editor (VS Code recommended)

2. **Recommended VS Code Extensions**:
   - TypeScript Importer
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter

3. **Development Setup**:
```bash
# Clone and setup
git clone https://github.com/ebrandi/puzzle-generator.git
cd puzzle-generator/app

# Install dependencies
yarn install

# Start development server
yarn dev

# Open in browser
open http://localhost:3000
```

### Common Development Tasks

#### Adding a New Word Theme

1. **Create word files** for each language:
```bash
touch app/public/data/en/new-theme.txt
touch app/public/data/pt/new-theme.txt
touch app/public/data/es/new-theme.txt
```

2. **Add words** in proper format:
```
# app/public/data/en/new-theme.txt
EXAMPLE|A sample word for demonstration|1
SAMPLE|Something used to show or test|2
```

3. **Register theme** in `types.ts`:
```typescript
export const AVAILABLE_THEMES = [
  // existing themes...
  { id: 'new-theme', name: 'New Theme', description: 'Description here' }
] as const;
```

4. **Test the integration**:
```bash
yarn dev
# Navigate to app and test crossword generation with new theme
```

#### Modifying PDF Layout

1. **Locate PDF generator** (`lib/pdf-generator.ts`)
2. **Identify the relevant method**:
   - `generateCrosswordPDF()` for crosswords
   - `generateWordSearchPDF()` for word searches
   - `generateSudokuPDF()` for Sudoku

3. **Make layout changes**:
```typescript
// Example: Adjust header size
const headerY = 20; // Increase for larger header
doc.setFontSize(16); // Adjust font size
```

4. **Test PDF generation**:
   - Generate puzzle in browser
   - Export PDF and verify changes
   - Test across different puzzle sizes

#### Performance Optimization

1. **Profile the application**:
```bash
# Build production version
yarn build

# Analyze bundle
yarn build --analyze
```

2. **Common optimization areas**:
   - Word database loading (implement lazy loading)
   - PDF generation (optimize large grids)
   - Component re-renders (use React.memo)
   - Algorithm efficiency (optimize backtracking)

### Build and Deployment

#### Local Build
```bash
cd app
yarn build
yarn start
```

#### Production Build
```bash
# Static export (for static hosting)
yarn export

# Server build (for Node.js hosting)
yarn build
```

#### Automated Deployment
```bash
# Use the provided deployment script
cd puzzle-generator
./deploy.sh
```

## 🧪 Testing

### Manual Testing Procedures

#### Crossword Testing
1. **Basic Generation**:
   - Select crossword mode
   - Choose different languages
   - Test various grid sizes (10x10 to 21x21)
   - Try different word counts (5 to 50)
   - Test each difficulty level

2. **Theme Testing**:
   - Test each theme individually
   - Test multiple theme combinations
   - Verify word selection matches themes

3. **PDF Export**:
   - Generate crossword PDF
   - Generate answer key PDF
   - Verify layout and formatting

#### Word Search Testing
1. **Generation Verification**:
   - Test all grid sizes
   - Verify words are placed correctly
   - Check that words can be found in all directions

2. **Answer Key Accuracy**:
   - Generate word search
   - Export answer key
   - Manually verify word locations

#### Sudoku Testing
1. **Generation Quality**:
   - Test each difficulty level
   - Verify puzzles have unique solutions
   - Check that difficulty matches expectation

2. **Solution Verification**:
   - Test built-in solver
   - Verify answer key accuracy

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ **Use**: Commercial and private use allowed
- ✅ **Modify**: Modification allowed
- ✅ **Distribute**: Distribution allowed
- ✅ **Private Use**: Private use allowed
- ❌ **Liability**: No warranty or liability
- ❌ **Warranty**: No warranty provided
- ℹ️ **Condition**: License and copyright notice must be included

### Third-Party Licenses

This project uses several open-source libraries:

- **Next.js**: MIT License
- **React**: MIT License  
- **Tailwind CSS**: MIT License
- **Radix UI**: MIT License
- **jsPDF**: MIT License
- **Lucide React**: ISC License

All third-party licenses are compatible with this project's MIT License.

---

## 📞 Developer Support

### Getting Help

- **Technical Issues**: Create a GitHub issue with detailed information
- **Development Questions**: Use GitHub Discussions for broader topics
- **Contribution Questions**: Review this guide and existing issues
- **Architecture Decisions**: Check git history and commit messages for context

### Joining the Community

- **Star the repository** to stay updated
- **Fork and contribute** to help improve the project
- **Share feedback** about your experience
- **Help other developers** in discussions and issues

---

**Happy Coding! 🧩💻**
