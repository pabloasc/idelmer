'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getPatternForLetter } from '../utils/patterns';

interface WordDisplayProps {
  word: string;
  revealedLetters: Set<string>;
  letterColors: { [key: string]: string };
  onGuess?: (guess: string) => void;
  guess?: string;
  isActive?: boolean;
}

const WordDisplay = ({ 
  word, 
  revealedLetters, 
  letterColors, 
  onGuess,
  guess = '',
  isActive = true
}: WordDisplayProps) => {
  const [userInput, setUserInput] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(isActive);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Create a map to store unique pattern IDs for each letter
  const letterPatterns = new Map<string, string>();
  word.split('').forEach(letter => {
    if (!letterPatterns.has(letter.toLowerCase()) && letter !== ' ') {
      const pattern = getPatternForLetter(letter.toLowerCase(), word.toLowerCase());
      letterPatterns.set(letter.toLowerCase(), pattern.id);
    }
  });

  // Get array of letter positions that need to be filled, skipping revealed letters
  const letterPositions = word.split('').map((letter, index) => ({
    index,
    letter: letter.toLowerCase(),
    isRevealed: revealedLetters.has(letter.toLowerCase())
  }));

  // Filter out revealed positions for user input
  const emptyPositions = letterPositions
    .filter(pos => !pos.isRevealed)
    .map((pos, inputIndex) => ({
      ...pos,
      inputIndex
    }));

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive && guess) {
      // For completed guesses, show the full guess
      setUserInput(guess.split(''));
    } else if (isActive && !guess) {
      // For active guess, start empty if no guess
      setUserInput([]);
    }
  }, [guess, isActive]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive || !onGuess) return;

    if (e.key === 'Enter') {
      if (userInput.length === 0) return; // Don't submit if no input
      
      const fullGuess = word.split('').map((letter, index) => {
        const pos = letterPositions[index];
        if (pos.isRevealed) {
          return letter;
        }
        const inputIndex = emptyPositions.findIndex(p => p.index === index);
        return userInput[inputIndex] || '_';
      }).join('');
      
      onGuess(fullGuess);
      setUserInput([]);
    } else if (e.key === 'Backspace') {
      e.preventDefault(); // Prevent default backspace behavior
      if (userInput.length > 0) {
        setUserInput(prev => prev.slice(0, -1));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive) return;
    
    const newChar = e.target.value.slice(-1).toUpperCase();
    if (!newChar || userInput.length >= emptyPositions.length) return;
    setUserInput(prev => [...prev, newChar]);
  };

  const handleContainerClick = () => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  const getDisplayLetter = (index: number) => {
    const pos = letterPositions[index];
    
    // If the letter is revealed, show it
    if (pos.isRevealed) {
      return word[index];
    }
    
    // For inactive (previous) guesses, show the guessed letter
    if (!isActive) {
      return guess?.[index] || '';
    }
    
    // For active guess, show user input if it exists
    const inputIndex = emptyPositions.findIndex(p => p.index === index);
    return inputIndex !== -1 ? userInput[inputIndex] || '' : '';
  };

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {Array.from(letterPatterns.entries()).map(([letter, patternId]) => {
            const pattern = getPatternForLetter(letter, word.toLowerCase());
            return React.cloneElement(pattern.pattern as React.ReactElement, {
              key: letter,
              id: `pattern-${letter}`,
            });
          })}
        </defs>
      </svg>
      <div 
        className={`flex flex-col items-center gap-4 ${!isActive ? 'opacity-60' : ''}`}
        onClick={handleContainerClick}
      >
        {isActive && (
          <input
            ref={inputRef}
            type="text"
            value=""
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="opacity-0 absolute w-px h-px"
            autoFocus={isActive}
          />
        )}
        <div className="flex flex-wrap justify-center gap-8 my-8 relative">
          {word.split('').map((letter, index) => {
            const pos = letterPositions[index];
            const inputIndex = !pos.isRevealed ? emptyPositions.findIndex(p => p.index === index) : -1;
            const showCursor = isActive && isFocused && !pos.isRevealed && 
              (inputIndex === userInput.length || (userInput.length === 0 && inputIndex === 0));
            
            // Get the letter to display (revealed, guessed, or user input)
            const displayLetter = getDisplayLetter(index);
            const targetLetter = word[index].toLowerCase();
            const pattern = getPatternForLetter(targetLetter, word.toLowerCase());
            const bgColor = letterColors[targetLetter];
            
            return (
              <div key={index} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div 
                    className={`h-12 w-8 flex items-end justify-center font-serif text-2xl relative rounded-sm overflow-hidden
                      ${pos.isRevealed ? 'text-green-600 font-bold' : ''}`}
                    style={{
                      backgroundColor: bgColor || 'rgba(240, 240, 240, 0.3)',
                    }}
                  >
                    {/* Background pattern */}
                    <svg 
                      className="absolute inset-0 w-full h-full"
                      style={{
                        color: '#000',
                        opacity: 0.2,
                      }}
                    >
                      {pattern.pattern}
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#${pattern.id})`}
                      />
                    </svg>
                    {/* Letter */}
                    <div className="relative z-10">
                      {displayLetter}
                    </div>
                    {/* Cursor */}
                    {showCursor && (
                      <div className="absolute bottom-0 w-0.5 h-8 bg-black animate-blink z-20" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default WordDisplay;
