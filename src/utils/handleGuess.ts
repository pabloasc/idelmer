type GuessState = {
  guess: string;
  revealedLetters: Set<string>;
};

export const handleGuessCommon = (
  guess: string,
  currentWord: string,
  guesses: GuessState[],
  attempts: number,
  score: number,
  setGuesses: React.Dispatch<React.SetStateAction<GuessState[]>>,
  setAttempts: React.Dispatch<React.SetStateAction<number>>,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  setHasWon: React.Dispatch<React.SetStateAction<boolean>>,
  setHasLost: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const currentGuessState = guesses[guesses.length - 1];
  const isCorrect = guess.toLowerCase() === currentWord.toLowerCase();
  const allLetters = new Set(currentWord.toLowerCase().split(''));

  // Check if all letters are revealed
  const allLettersRevealed = Array.from(allLetters).every(letter =>
    currentGuessState.revealedLetters.has(letter)
  );

  if (isCorrect || allLettersRevealed) {
    setGuesses((prev: GuessState[]) => [
      ...prev.slice(0, -1),
      { guess: isCorrect ? guess : prev[prev.length - 1].guess, revealedLetters: allLetters }
    ]);
    setHasWon(true);
    return;
  }

  const newAttempts = attempts + 1;
  setAttempts(newAttempts);
  const newScore = Math.max(0, score - 20);
  setScore(newScore);

  if(newScore === 0) {
    setHasLost(true)
  }

  const newRevealed = new Set(guesses[guesses.length - 1].revealedLetters);

  // Check exact matches
  guess.toLowerCase().split('').forEach((letter, index) => {
    if (currentWord[index]?.toLowerCase() === letter) {
      newRevealed.add(letter);
    }
  });

  // Check letters in wrong positions
  const wordLetterCounts: Record<string, number> = {};
  currentWord.toLowerCase().split('').forEach(letter => {
    wordLetterCounts[letter] = (wordLetterCounts[letter] || 0) + 1;
  });

  const guessLetterCounts: Record<string, number> = {};
  guess.toLowerCase().split('').forEach((letter, index) => {
    if (currentWord[index]?.toLowerCase() !== letter && !newRevealed.has(letter)) {
      guessLetterCounts[letter] = (guessLetterCounts[letter] || 0) + 1;
      if (wordLetterCounts[letter] && guessLetterCounts[letter] <= wordLetterCounts[letter]) {
        newRevealed.add(letter);
      }
    }
  });

  // Check if all letters are revealed after the guess
  const allLettersRevealedAfterGuess = Array.from(allLetters).every(letter => 
    newRevealed.has(letter as string)
  );
  
  if (allLettersRevealedAfterGuess) {
    setGuesses((prev: GuessState[]) => [
      ...prev.slice(0, -1),
      { guess, revealedLetters: allLetters }
    ]);
    setHasWon(true);
    return;
  }

  setGuesses((prev: GuessState[]) => [
    ...prev.slice(0, -1),
    { guess, revealedLetters: prev[prev.length - 1].revealedLetters },
    { guess: '', revealedLetters: newRevealed }
  ]);

  if (newScore === 0) {
    setScore(0);
    setHasLost(true);
  }
};
