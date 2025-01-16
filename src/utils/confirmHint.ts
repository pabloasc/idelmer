import { Dispatch, SetStateAction } from 'react';

interface GuessState {
  guess: string;
  revealedLetters: Set<string>;
}

interface ConfirmHintParams {
  currentWord: string;
  guesses: GuessState[];
  setGuesses: Dispatch<SetStateAction<GuessState[]>>;
  setScore: Dispatch<SetStateAction<number>>;
  setHasWon: Dispatch<SetStateAction<boolean>>;
}

export const confirmHint = async ({
  currentWord,
  guesses,
  setGuesses,
  setScore,
  setHasWon,
}: ConfirmHintParams) => {
  if (!currentWord) return;
  
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
      { ...prev[prev.length - 1], revealedLetters: newRevealed }
    ]);
    
    setScore(prev => Math.max(0, prev - 30));

    const allLetters = new Set(currentWord.toLowerCase().split(''));
    const allLettersRevealed = Array.from(allLetters).every(letter => 
      newRevealed.has(letter as string)
    );

    if (allLettersRevealed) {
      setHasWon(true);
    }
  }
};
