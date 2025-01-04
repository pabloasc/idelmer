import { Dispatch, SetStateAction } from 'react';
import { getRandomWord } from '@/data/wordBank';
import { generateColors } from './generateColors';

interface GuessState {
  guess: string;
  revealedLetters: Set<string>;
}

interface StartNewGameParams {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  setCurrentWord: Dispatch<SetStateAction<string>>;
  setLetterColors: Dispatch<SetStateAction<{ [key: string]: string }>>;
  setAttempts: Dispatch<SetStateAction<number>>;
  setScore: Dispatch<SetStateAction<number>>;
  setHasWon: Dispatch<SetStateAction<boolean>>;
  setHasLost: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
  setGuesses: Dispatch<SetStateAction<GuessState[]>>;
}

export const startNewGame = ({
  difficulty,
  setCurrentWord,
  setLetterColors,
  setAttempts,
  setScore,
  setHasWon,
  setHasLost,
  setError,
  setGuesses,
}: StartNewGameParams) => {
  const newWord = getRandomWord(difficulty).toUpperCase();
  setCurrentWord(newWord);
  setLetterColors(generateColors(newWord));
  setAttempts(1);
  setScore(100);
  setHasWon(false);
  setHasLost(false);
  setError('');
  
  // Reveal a repeated letter
  const letterCounts: { [key: string]: number } = {};
  newWord.toLowerCase().split('').forEach((letter: string) => {
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  });
  
  //eslint-disable-next-line
  const repeatedLetter = Object.entries(letterCounts).find(([letter, count]) => Number(count) > 1)?.[0];
    
  setGuesses([{
    guess: '',
    revealedLetters: new Set(repeatedLetter ? [repeatedLetter] : [])
  }]);
};
