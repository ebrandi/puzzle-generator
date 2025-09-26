
# 🧩 Ebrandi Puzzle Generator

<div align="center">
  <img src="app/public/logos/logo-wide.png" alt="Ebrandi Puzzle Generator Logo" width="400">
</div>

<div align="center">
  <strong>Educational Puzzles for Learning Minds</strong>
</div>

<br>

A comprehensive, multilingual puzzle generator built with Next.js. Create professional-quality **crossword puzzles**, **word search games**, and **Sudoku puzzles** with customizable themes, difficulty levels, and export options.

## 📖 Table of Contents
- [Features](#features)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start (Automated)](#quick-start-automated)
- [Manual Installation](#manual-installation)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎮 Three Game Modes
- **🧩 Crossword Puzzles**: Classic word puzzles with themed clues
- **🔍 Word Search Games**: Find hidden words in letter grids
- **🔢 Sudoku Puzzles**: Classic 9×9 number logic puzzles

### 🌍 Multilingual Support (Crossword & Word Search)
- **English** - Comprehensive word database
- **Português** - Brazilian Portuguese support
- **Español** - Spanish language support

### 🎯 Customizable Puzzle Generation
#### Crossword & Word Search Options:
- **Grid Sizes**: 10x10 to 21x21
- **Word Count**: 5 to 50 words per puzzle
- **Difficulty Levels**: Easy, Medium, Hard
- **Theme Categories**:
  - General Knowledge
  - Science & Nature
  - Arts & Culture
  - Sports
  - Technology
  - History & Geography
  - Literature
  - Mathematics
  - Health
  - Animals
  - Entertainment
  - Food & Cooking
  - Travel & Places

#### Sudoku Options:
- **Standard 9×9 Grid**: Classic Sudoku format
- **Multiple Difficulty Levels**: From easy to expert
- **Unique Solutions**: Each puzzle has exactly one solution
- **Solution Export**: Separate answer key included

### 📄 Professional PDF Export
- **Puzzle PDF**: Clean grids with numbered clues/instructions
- **Answer Key PDF**: Complete solution guides for all game types
- **Professional Layout**: Optimized for printing and classroom use
- **Custom Branding**: Professional headers with logo integration

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Preview**: See your crossword as you customize
- **Intuitive Controls**: Sliders and dropdowns for easy configuration
- **Professional Styling**: Clean, modern interface

## 🔗 Live Demo

Visit the deployed application: [https://puzzles.genprix.xyz](https://puzzles.genprix.xyz)

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **PDF Generation**: jsPDF
- **Build Tool**: Yarn
- **Deployment**: Static export compatible

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **Yarn**: 1.22.0 or higher (recommended) or npm 9.0.0+
- **Operating System**: Ubuntu 24.04 LTS (or compatible Linux distribution)

### Hardware Requirements
- **RAM**: 2GB minimum 
- **Storage**: 500MB free space
- **CPU**: Any modern processor 

## 🚀 Quick Start (Automated)

For the fastest setup, use our automated deployment script:

```bash
# Download and run the deployment script
curl -fsSL https://raw.githubusercontent.com/ebrandi/puzzle-generator/main/deploy.sh | bash
```

Or clone the repository and run locally:

```bash
git clone https://github.com/ebrandi/puzzle-generator.git
cd puzzle-generator
chmod +x deploy.sh
./deploy.sh
```

The script will:
✅ Check system requirements  
✅ Install missing dependencies  
✅ Setup the application  
✅ Start the development server  

## 🔧 Manual Installation

### Step 1: Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Node.js and Yarn

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn -y

# Verify installations
node --version  # Should be 18.x or higher
yarn --version  # Should be 1.22.x or higher
```

### Step 3: Clone the Repository

```bash
git clone https://github.com/ebrandi/puzzle-generator.git
cd puzzle-generator
```

### Step 4: Install Dependencies

```bash
cd app
yarn install
```

### Step 5: Build and Start the Application

#### Development Mode
```bash
yarn dev
# Application will be available at http://localhost:3000
```

#### Production Mode
```bash
yarn build
yarn start
# Application will be available at http://localhost:3000
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage Guide

### Getting Started

1. **Select Game Type**: Choose from Crossword, Word Search, or Sudoku
2. **Configure Your Puzzle**: Each game type has specific options
3. **Generate**: Click the generate button to create your puzzle
4. **Preview**: Review the puzzle in the web interface
5. **Export**: Download as PDF (puzzle and answer key)

### Creating Crossword Puzzles

1. **Select Language**: Choose from English, Português, or Español
2. **Configure Grid Size**: Use the slider to set dimensions (10x10 to 21x21)
3. **Set Word Count**: Adjust target number of words (5-50)
4. **Choose Themes**: Select one or more categories for word selection
5. **Set Difficulty**: Pick Easy, Medium, or Hard
6. **Generate**: Click "Generate Crossword" to create your puzzle
7. **Export**: Download puzzle and answer key as separate PDFs

### Creating Word Search Games

1. **Select Language**: Choose from English, Português, or Español
2. **Configure Grid Size**: Set grid dimensions (10x10 to 21x21)
3. **Set Word Count**: Choose number of hidden words (5-50)
4. **Choose Themes**: Select categories for word selection
5. **Set Difficulty**: Pick Easy, Medium, or Hard
6. **Generate**: Click "Generate Word Search" to create your puzzle
7. **Export**: Download puzzle with word list and answer key

### Creating Sudoku Puzzles

1. **Select Difficulty**: Choose from Easy, Medium, Hard, or Expert
2. **Generate**: Click "Generate Sudoku" to create a unique puzzle
3. **Solve**: Use the interface to test the puzzle yourself
4. **Export**: Download puzzle and solution as separate PDFs

### Tips for Best Results

**For Crossword & Word Search:**
- **Start Small**: Begin with 15x15 grids and 15-25 words
- **Mix Themes**: Combine 2-3 themes for variety
- **Check Preview**: Review the web preview before exporting

**For Sudoku:**
- **Test Difficulty**: Try solving the puzzle to verify difficulty level
- **Print Quality**: Use PDF export for crisp number printing

**General:**
- **Print Settings**: Use PDF export for best print quality
- **Preview First**: Always review puzzles before printing
- **Save Favorites**: Keep track of successful configurations

### Troubleshooting

#### Common Issues

**Crossword & Word Search Issues:**

**"Not enough words available" Error**
- Solution: Reduce target word count or add more themes
- Check that your selected language has sufficient words for chosen themes

**Grid appears cut off**
- Solution: Use smaller grid size or check your screen resolution
- Try different browser zoom levels

**Sudoku Issues:**

**Puzzle seems too easy/hard**
- Solution: Try a different difficulty level
- Remember that difficulty can vary even within the same level

**General Issues:**

**PDF export not working**
- Solution: Ensure your browser allows PDF downloads
- Check that pop-up blockers aren't preventing downloads

**Application won't start**
- Solution: Ensure all dependencies are installed with `yarn install`
- Check that you're running Node.js 18.x or higher

## 📁 Project Structure

```
puzzle-generator/
├── app/                          # Next.js application
│   ├── app/                      # App router pages
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main page
│   ├── components/              # React components
│   │   ├── ui/                  # Radix UI components
│   │   ├── crossword-display.tsx      # Crossword grid visualization
│   │   ├── word-search-display.tsx    # Word search grid display
│   │   ├── word-search-answer-display.tsx # Word search solutions
│   │   ├── sudoku-display.tsx          # Sudoku grid interface
│   │   ├── sudoku-answer-display.tsx   # Sudoku solutions
│   │   ├── crossword-generator-app.tsx # Main application component
│   │   └── configuration-panel.tsx     # Settings interface
│   ├── lib/                     # Core game logic and utilities
│   │   ├── crossword-generator.ts      # Crossword puzzle algorithm
│   │   ├── word-search-generator.ts    # Word search game algorithm
│   │   ├── sudoku-generator.ts         # Sudoku puzzle algorithm
│   │   ├── pdf-generator.ts            # PDF export for all game types
│   │   ├── word-database.ts            # Word loading utilities
│   │   ├── types.ts                    # TypeScript definitions
│   │   └── utils.ts                    # Shared utilities
│   ├── public/                  # Static assets
│   │   ├── data/               # Word databases (Crossword & Word Search)
│   │   │   ├── en/            # English word lists by theme
│   │   │   ├── pt/            # Portuguese word lists by theme
│   │   │   └── es/            # Spanish word lists by theme
│   │   ├── logos/             # Professional application logos
│   │   │   ├── logo-wide.png       # Horizontal logo for headers
│   │   │   ├── logo-square.png     # Square logo for icons
│   │   │   └── logo-square-alt.png # Alternative square logo
│   │   └── flags/             # Language flag images
│   ├── package.json            # Dependencies and scripts
│   └── next.config.js          # Next.js configuration
├── deploy.sh                   # Automated deployment script
├── .gitignore                  # Git ignore rules
└── README.md                   # This documentation file
```

### Key Files by Feature

#### Core Game Generators
- **`lib/crossword-generator.ts`**: Advanced crossword puzzle generation with word placement
- **`lib/word-search-generator.ts`**: Word search creation with multi-directional word placement
- **`lib/sudoku-generator.ts`**: Sudoku puzzle generation with unique solution validation

#### Display Components
- **`components/crossword-display.tsx`**: Interactive crossword grid visualization
- **`components/word-search-display.tsx`**: Word search grid with highlighting
- **`components/sudoku-display.tsx`**: Interactive Sudoku grid interface
- **`components/*-answer-display.tsx`**: Solution display components for each game type

#### Shared Systems
- **`lib/pdf-generator.ts`**: Multi-format PDF export system supporting all game types
- **`components/configuration-panel.tsx`**: Unified settings interface for all games
- **`components/crossword-generator-app.tsx`**: Main application orchestrator
- **`lib/word-database.ts`**: Multilingual word database management

#### Assets & Data
- **`public/data/{lang}/`**: Multilingual word databases organized by theme
- **`public/logos/`**: Professional branding assets and application logos
- **`public/flags/`**: Language flag images for UI

## 🔧 Extending the Application

### 📝 Word Database Structure (Crossword & Word Search)

The crossword and word search generators use text-based word databases organized by language and theme. Understanding this structure allows you to easily add new words or create entirely new categories.

**Note:** Sudoku puzzles are generated algorithmically and do not use word databases.

#### 🗂 File Organization

```
app/public/data/
├── en/                    # English words
│   ├── animals.txt
│   ├── science-nature.txt
│   ├── general-knowledge.txt
│   └── [theme-name].txt
├── pt/                    # Portuguese words
│   ├── animals.txt
│   ├── science-nature.txt
│   └── [theme-name].txt
└── es/                    # Spanish words
    ├── animals.txt
    ├── science-nature.txt
    └── [theme-name].txt
```

#### 📋 Word Database Format

Each `.txt` file contains words in the following format:
```
WORD|CLUE|DIFFICULTY_LEVEL
```

**Format Details:**
- **WORD**: The answer (uppercase, no spaces, letters only)
- **CLUE**: The hint shown to users (descriptive, clear)
- **DIFFICULTY_LEVEL**: Number from 1-3 (1=Easy, 2=Medium, 3=Hard)

**Example entries:**
```
DOG|Man's best friend|1
ELEPHANT|Largest land animal|2
RHINOCEROS|Large horned African animal|3
```

#### ✏️ Adding Words to Existing Categories

To add words to an existing theme:

1. **Navigate to the appropriate file**:
   ```bash
   app/public/data/{language}/{theme-name}.txt
   ```

2. **Add entries following the format**:
   ```
   NEWWORD|Description of the new word|2
   ANOTHERWORD|Another descriptive clue|1
   ```

3. **Guidelines for good entries**:
   - **Words**: Use common spelling, avoid proper nouns unless theme-appropriate
   - **Clues**: Be clear and concise, avoid ambiguity
   - **Difficulty**: Consider word length and obscurity
     - **Level 1 (Easy)**: 3-6 letters, common words
     - **Level 2 (Medium)**: 5-10 letters, moderate complexity
     - **Level 3 (Hard)**: 7+ letters, specialized terms

#### 🆕 Creating New Categories

To create a completely new theme category:

1. **Create the word database files**:
   ```bash
   # Create files for each supported language
   touch app/public/data/en/your-theme-name.txt
   touch app/public/data/pt/your-theme-name.txt  
   touch app/public/data/es/your-theme-name.txt
   ```

2. **Add words to each file** following the format above

3. **Update the theme registry** in `app/lib/types.ts`:
   ```typescript
   export const AVAILABLE_THEMES = [
     // ... existing themes ...
     { 
       id: 'your-theme-name', 
       name: 'Your Theme Display Name', 
       description: 'Brief description of your theme' 
     },
   ] as const;
   ```

4. **File naming conventions**:
   - Use lowercase letters only
   - Separate words with hyphens (kebab-case)
   - Be descriptive but concise
   - Examples: `space-astronomy.txt`, `world-religions.txt`, `board-games.txt`

#### 🌍 Adding New Languages

To add support for a new language:

1. **Create the language directory**:
   ```bash
   mkdir app/public/data/[language-code]
   ```

2. **Copy all theme files** from an existing language:
   ```bash
   cp app/public/data/en/*.txt app/public/data/[language-code]/
   ```

3. **Translate all words and clues** in the new files

4. **Add a flag image**:
   ```bash
   # Add a flag image to app/public/flags/
   app/public/flags/[country-code]-flag.png
   ```

5. **Register the language** in `app/lib/types.ts`:
   ```typescript
   export const AVAILABLE_LANGUAGES = [
     // ... existing languages ...
     { 
       id: '[language-code]', 
       name: 'Language Name', 
       flag: '/flags/[country-code]-flag.png' 
     },
   ] as const;
   ```

#### 🎯 Best Practices

**Word Selection:**
- Choose words that fit the theme clearly
- Avoid abbreviations and acronyms unless theme-appropriate
- Include a mix of difficulty levels (60% easy, 30% medium, 10% hard)
- Test words in actual crosswords to ensure they work well

**Clue Writing:**
- Be specific enough to avoid multiple correct answers
- Use simple, clear language
- Avoid cultural references that might not translate
- Keep clues under 50 characters when possible

**Quality Control:**
- **Spell check**: Verify all words and clues
- **Test generation**: Create crosswords with your new words
- **Cross-reference**: Ensure words intersect well with others
- **Review difficulty**: Confirm difficulty levels are appropriate

#### 📊 Content Guidelines

**Minimum Words per Category:**
- **Small themes**: 50+ words minimum
- **Medium themes**: 100+ words recommended  
- **Large themes**: 200+ words for best variety

**Word Length Distribution:**
- **3-5 letters**: 40% (good for intersections)
- **6-8 letters**: 35% (balanced difficulty)
- **9-12 letters**: 20% (challenging)
- **13+ letters**: 5% (expert level)

#### 🔄 Testing Your Changes

After adding words or categories:

1. **Rebuild the application**:
   ```bash
   cd app && yarn build
   ```

2. **Test puzzle generation**:
   - **Crosswords**: Try your new theme/words across difficulty levels
   - **Word Search**: Verify words appear correctly in grids
   - **Sudoku**: Test that generation still works (not affected by word changes)
   - Test PDF export functionality for all game types

3. **Validate word database format**:
   ```bash
   # Check for format errors
   grep -v "^[A-Z]*|.*|[123]$" app/public/data/en/your-file.txt
   ```

4. **Cross-game testing**:
   - Switch between game types to ensure UI works correctly
   - Test all three PDF export formats
   - Verify theme selection works for word-based games

#### 🧪 Example: Creating a "Music" Theme

1. **Create the files**:
   ```bash
   touch app/public/data/en/music.txt
   touch app/public/data/pt/music.txt
   touch app/public/data/es/music.txt
   ```

2. **Add English words** (`app/public/data/en/music.txt`):
   ```
   PIANO|Black and white keyboard instrument|1
   GUITAR|Stringed instrument with frets|1
   VIOLIN|Bowed string instrument|2
   SAXOPHONE|Brass instrument invented by Adolphe Sax|3
   MELODY|Sequence of musical notes|2
   RHYTHM|Pattern of beats in music|2
   ```

3. **Add Portuguese translations** (`app/public/data/pt/music.txt`):
   ```
   PIANO|Instrumento de teclado preto e branco|1
   VIOLAO|Instrumento de cordas com trastes|1
   VIOLINO|Instrumento de cordas tocado com arco|2
   SAXOFONE|Instrumento de sopro inventado por Adolphe Sax|3
   MELODIA|Sequência de notas musicais|2
   RITMO|Padrão de batidas na música|2
   ```

4. **Register in types.ts**:
   ```typescript
   { id: 'music', name: 'Music', description: 'Musical instruments, terms, and concepts' },
   ```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add word databases**: Contribute words in new languages or themes
5. **Test thoroughly**: Ensure all features work correctly
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain consistent code formatting
- Add comments for complex algorithms
- Test on multiple browsers and devices
- Follow word database format strictly (for Crossword & Word Search)
- Include translations for all supported languages
- Test all three game types thoroughly
- Ensure PDF export works for all puzzle formats
- Maintain responsive design across game modes

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please:

1. **Check existing issues** to avoid duplicates
2. **Create a detailed issue** with:
   - Steps to reproduce
   - Expected vs. actual behavior
   - Browser/OS information
   - Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **My Family**: For inspiring this educational puzzle tool
- **Next.js Team**: For the amazing React framework
- **Radix UI**: For accessible component primitives
- **Community Contributors**: For word database additions and puzzle improvements
- **Educators**: For feedback that shaped the multi-format approach

## 📞 Support

Need help? Here are your options:

- **Documentation**: Check this README and code comments
- **Issues**: Create a GitHub issue for bugs or features
- **Discussions**: Use GitHub Discussions for general questions

## 🎯 Game-Specific Support

**For Crossword Issues**: Check word database format and theme availability
**For Word Search Issues**: Verify language support and grid settings  
**For Sudoku Issues**: Ensure difficulty level matches your needs
**For PDF Issues**: Check browser settings and pop-up blockers

---

**Happy Puzzle Creating! 🧩🔍🔢**

Made with ❤️ by the Ebrandi for educational excellence.
