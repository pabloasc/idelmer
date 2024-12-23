'use client';

import { useState, useEffect } from 'react';
import WordDisplay from '@/components/WordDisplay';
import ScoreDisplay from '@/components/ScoreDisplay';

interface GuessState {
  guess: string;
  revealedLetters: Set<string>;
}

const generateColors = (word: string): { [key: string]: string } => {
  const colors = {};
  const uniqueLetters = Array.from(new Set(word.toLowerCase().split('')));
  const colorOptions = [
    'rgba(255, 182, 193, 0.3)', // Light pink
    'rgba(152, 251, 152, 0.3)', // Pale green
    'rgba(135, 206, 235, 0.3)', // Sky blue
    'rgba(221, 160, 221, 0.3)', // Plum
    'rgba(240, 230, 140, 0.3)', // Khaki
    'rgba(230, 230, 250, 0.3)', // Lavender
    'rgba(255, 160, 122, 0.3)', // Light salmon
    'rgba(176, 224, 230, 0.3)', // Powder blue
  ];
  
  const shuffledColors = [...colorOptions].sort(() => Math.random() - 0.5);
  uniqueLetters.forEach((letter, index) => {
    if (letter !== ' ') {
      colors[letter] = shuffledColors[index % shuffledColors.length];
    }
  });
  
  return colors;
};

export default function Home() {
  const [currentWord, setCurrentWord] = useState('');
  const [letterColors, setLetterColors] = useState({});
  const [guesses, setGuesses] = useState<GuessState[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(100);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDailyWord = async () => {
      try {
        const response = await fetch('/api/daily-word');
        if (!response.ok) throw new Error('Failed to fetch daily word');
        
        const data = await response.json();
        if (!data.word) throw new Error('No word received from API');
        
        const newWord = data.word.toUpperCase();
        setCurrentWord(newWord);
        setLetterColors(generateColors(newWord));
        
        // Reveal a repeated letter
        const letterCounts = {};
        newWord.toLowerCase().split('').forEach(letter => {
          letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        });
        
        const repeatedLetter = Object.entries(letterCounts)
          .find(([letter, count]) => Number(count) > 1)?.[0];
          
        setGuesses([{
          guess: '',
          revealedLetters: new Set(repeatedLetter ? [repeatedLetter] : [])
        }]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching daily word:', err);
        setError(err instanceof Error ? err.message : 'Failed to load today\'s word');
        setLoading(false);
      }
    };

    fetchDailyWord();
  }, []);

  const handleGuess = (guess: string) => {
    if (!currentWord) return;
    
    setAttempts(prev => prev + 1);
    
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      const allLetters = new Set(currentWord.toLowerCase().split(''));
      setGuesses(prev => [
        ...prev.slice(0, -1),
        { guess, revealedLetters: allLetters }
      ]);
    } else {
      const newRevealed = new Set(guesses[guesses.length - 1].revealedLetters);
      
      // Check exact matches
      guess.toLowerCase().split('').forEach((letter, index) => {
        if (currentWord[index]?.toLowerCase() === letter) {
          newRevealed.add(letter);
        }
      });

      // Check letters in wrong positions
      const wordLetterCounts = {};
      currentWord.toLowerCase().split('').forEach(letter => {
        wordLetterCounts[letter] = (wordLetterCounts[letter] || 0) + 1;
      });

      const guessLetterCounts = {};
      guess.toLowerCase().split('').forEach((letter, index) => {
        if (currentWord[index]?.toLowerCase() !== letter && !newRevealed.has(letter)) {
          guessLetterCounts[letter] = (guessLetterCounts[letter] || 0) + 1;
          if (wordLetterCounts[letter] && guessLetterCounts[letter] <= wordLetterCounts[letter]) {
            newRevealed.add(letter);
          }
        }
      });
      
      setGuesses(prev => [
        ...prev.slice(0, -1),
        { guess, revealedLetters: prev[prev.length - 1].revealedLetters },
        { guess: '', revealedLetters: newRevealed }
      ]);
      
      setScore(prev => Math.max(0, prev - 20));
    }
  };

  const handleHint = () => {
    if (!currentWord || score <= 0) return;

    const currentRevealedLetters = guesses[guesses.length - 1].revealedLetters;
    const unrevealedLetters = currentWord.toLowerCase().split('')
      .filter(letter => !currentRevealedLetters.has(letter));

    if (unrevealedLetters.length === 0) return;

    const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
    const newRevealed = new Set(currentRevealedLetters);
    newRevealed.add(randomLetter);

    setGuesses(prev => [
      ...prev.slice(0, -1),
      { ...prev[prev.length - 1], revealedLetters: newRevealed }
    ]);

    setScore(prev => Math.max(0, prev - 10));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-newyorker-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-xl text-center">Loading today's word...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-newyorker-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-xl text-center text-red-500">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-newyorker-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Word Game</h1>
        
        <div className="flex justify-between items-center mb-8">
          <ScoreDisplay attempts={attempts} score={score} />
          <button
            onClick={handleHint}
            disabled={score <= 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              score > 0
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Get Hint (-10 points)
          </button>
        </div>
        
        <div className="flex flex-col gap-8">
          {guesses.map((guessState, index) => (
            <WordDisplay
              key={index}
              word={currentWord}
              revealedLetters={guessState.revealedLetters}
              letterColors={letterColors}
              onGuess={index === guesses.length - 1 ? handleGuess : undefined}
              guess={guessState.guess}
              isActive={index === guesses.length - 1}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
