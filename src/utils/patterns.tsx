import React from 'react';

interface PatternDefinition {
  id: string;
  pattern: JSX.Element;
}

// All available patterns
const patterns: { [key: string]: PatternDefinition } = {
  dots: {
    id: 'dots',
    pattern: (
      <pattern id="dots" patternUnits="userSpaceOnUse" width="8" height="8">
        <circle cx="4" cy="4" r="2" fill="black" opacity="0.5" />
      </pattern>
    ),
  },
  lines: {
    id: 'lines',
    pattern: (
      <pattern id="lines" patternUnits="userSpaceOnUse" width="8" height="8">
        <line x1="0" y1="4" x2="8" y2="4" stroke="black" strokeWidth="2" opacity="0.5" />
      </pattern>
    ),
  },
  crosses: {
    id: 'crosses',
    pattern: (
      <pattern id="crosses" patternUnits="userSpaceOnUse" width="8" height="8">
        <path d="M2,2 L6,6 M6,2 L2,6" stroke="black" strokeWidth="1.5" opacity="0.5" />
      </pattern>
    ),
  },
  zigzag: {
    id: 'zigzag',
    pattern: (
      <pattern id="zigzag" patternUnits="userSpaceOnUse" width="8" height="8">
        <path d="M0,4 L4,0 L8,4" stroke="black" strokeWidth="1.5" opacity="0.5" />
      </pattern>
    ),
  },
  circles: {
    id: 'circles',
    pattern: (
      <pattern id="circles" patternUnits="userSpaceOnUse" width="8" height="8">
        <circle cx="4" cy="4" r="3" fill="none" stroke="black" strokeWidth="1.5" opacity="0.5" />
      </pattern>
    ),
  },
  squares: {
    id: 'squares',
    pattern: (
      <pattern id="squares" patternUnits="userSpaceOnUse" width="8" height="8">
        <rect x="1" y="1" width="6" height="6" fill="none" stroke="black" strokeWidth="1.5" opacity="0.5" />
      </pattern>
    ),
  },
  grid: {
    id: 'grid',
    pattern: (
      <pattern id="grid" patternUnits="userSpaceOnUse" width="8" height="8">
        <path d="M0,4 L8,4 M4,0 L4,8" stroke="black" strokeWidth="1.5" opacity="0.5" />
      </pattern>
    ),
  },
  diamonds: {
    id: 'diamonds',
    pattern: (
      <pattern id="diamonds" patternUnits="userSpaceOnUse" width="8" height="8">
        <path d="M4,1 L7,4 L4,7 L1,4 Z" stroke="black" strokeWidth="1.5" opacity="0.5" fill="none" />
      </pattern>
    ),
  },
};

// Keep track of used patterns for each word
const wordPatternMap = new Map<string, Map<string, string>>();

export const getPatternForLetter = (letter: string, word: string): PatternDefinition => {
  // Create or get the pattern map for this word
  if (!wordPatternMap.has(word)) {
    wordPatternMap.set(word, new Map());
    
    // Get unique letters from the word
    const uniqueLetters = Array.from(new Set(word.toLowerCase().split('')));
    
    // Get all available patterns and shuffle them
    const patternNames = Object.keys(patterns);
    const shuffledPatterns = [...patternNames].sort(() => Math.random() - 0.5);
    
    // Assign unique patterns to each unique letter
    uniqueLetters.forEach((letter, index) => {
      if (letter !== ' ') {
        const patternName = shuffledPatterns[index % shuffledPatterns.length];
        wordPatternMap.get(word)!.set(letter, patternName);
      }
    });
  }
  
  // Get the pattern assigned to this letter
  const patternName = wordPatternMap.get(word)!.get(letter.toLowerCase()) || 'dots';
  return patterns[patternName];
};
