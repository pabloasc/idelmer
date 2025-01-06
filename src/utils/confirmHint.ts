import { Dispatch, SetStateAction } from 'react';

interface GuessState {
  guess: string;
  revealedLetters: Set<string>;
}

interface ConfirmHintParams {
  currentWord: string;
  setShowHintConfirmation: Dispatch<SetStateAction<boolean>>;
  guesses: GuessState[];
  setGuesses: Dispatch<SetStateAction<GuessState[]>>;
  setScore: Dispatch<SetStateAction<number>>;
}

export const confirmHint = ({
  currentWord,
  setShowHintConfirmation,
  guesses,
  setGuesses,
  setScore,
}: ConfirmHintParams) => {
  if (!currentWord) return;
  
  setShowHintConfirmation(false);
  
  // Find an unrevealed letter that appears in the word
  const currentRevealed = guesses[guesses.length - 1].revealedLetters;
  const unrevealedLetters = currentWord
    .toLowerCase()
    .split('')
    .filter(letter => !currentRevealed.has(letter));
    
  if (unrevealedLetters.length > 0) {
    const randomIndex = Math.floor(Math.random() * unrevealedLetters.length);
    const hintLetter = unrevealedLetters[randomIndex];
    
    const newRevealed = new Set(currentRevealed);
    newRevealed.add(hintLetter);
    
    setGuesses(prev => [
      ...prev.slice(0, -1),
      { ...prev[prev.length - 1], revealedLetters: newRevealed, guess: '' }
    ]);
    
    setScore(prev => Math.max(0, prev - 30));
  }
};
