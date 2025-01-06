'use client';

import { useState, useEffect } from 'react';
import WordDisplay from '@/components/WordDisplay';
import ScoreDisplay from '@/components/ScoreDisplay';
import VictoryDisplay from '@/components/VictoryDisplay';
import GameOverDisplay from '@/components/GameOverDisplay';
import HintConfirmationModal from '@/components/HintConfirmationModal';
import { startNewGame } from '@/utils/startNewGame';
import { confirmHint } from '@/utils/confirmHint';

interface GuessState {
  guess: string;
  revealedLetters: Set<string>;
}

const PracticePage = () => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessState[]>([]);
  const [letterColors, setLetterColors] = useState<{ [key: string]: string }>({});
  const [attempts, setAttempts] = useState<number>(1);
  const [score, setScore] = useState<number>(100);
  const [error, setError] = useState<string>('');
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [showHintConfirmation, setShowHintConfirmation] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('easy');

  const handleStartNewGame = () => {
    startNewGame({
      difficulty,
      setCurrentWord,
      setLetterColors,
      setAttempts,
      setScore,
      setHasWon,
      setHasLost,
      setError,
      setGuesses,
    });
  };

  useEffect(() => {
    handleStartNewGame();
  }, [difficulty]);

  const handleGuess = (guess: string) => {
    if (!currentWord || hasWon || hasLost) return;
    
    const currentGuessState = guesses[guesses.length - 1];
    const isCorrect = guess.toLowerCase() === currentWord.toLowerCase();
    const allLetters = new Set(currentWord.toLowerCase().split(''));
    
    // Check if all letters are revealed
    const allLettersRevealed = Array.from(allLetters).every(letter => 
      currentGuessState.revealedLetters.has(letter)
    );

    if (isCorrect || allLettersRevealed) {
      setGuesses(prev => [
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
    
    setGuesses(prev => [
      ...prev.slice(0, -1),
      { guess, revealedLetters: prev[prev.length - 1].revealedLetters },
      { guess: '', revealedLetters: newRevealed }
    ]);
    
    if (newScore === 0) {
      setHasLost(true);
    }
  };

  const handleHint = () => {
    if (!currentWord || score <= 0 || hasWon || hasLost) return;
    setShowHintConfirmation(true);
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const handleConfirmHint = () => {
    setShowHintConfirmation(false);
    confirmHint({
      currentWord,
      guesses,
      setGuesses,
      setScore,
      setHasWon
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24 font-forum">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm font-forum">
        <div className="mb-8 flex justify-between items-center font-forum">
          <div></div>
          <div className="flex gap-4 font-forum">
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard' | 'expert')}
              className="px-4 py-2 rounded border border-gray-300 font-forum"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
            <button
              onClick={handleStartNewGame}
              className={`w-full max-w-xs border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
                transition-colors duration-200 hover:bg-black hover:text-white font-forum`}
            >
              New Game
            </button>
          </div>
        </div>

        <div className="text-center mb-8 font-forum">
          <h1 className="text-4xl font-bold mb-4 font-forum">Practice Area</h1>
          <p className="text-gray-600 font-forum">Practice your word-guessing skills</p>
        </div>

        {error ? (
          <div className="text-red-500 text-center font-forum">{error}</div>
        ) : (
          <>
            <div className="max-w-2xl mx-auto mb-12 space-y-8 font-forum">
              <ScoreDisplay score={score} attempts={attempts} />
              
              <div className="flex justify-center font-forum">
                <button
                  onClick={handleHint}
                  disabled={score <= 0 || hasWon || hasLost || score < 30}
                  className={`w-full max-w-xs border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
                    transition-colors duration-200 ${
                      score > 0 && !hasWon && !hasLost && score >= 30
                        ? 'hover:bg-black hover:text-white'
                        : 'opacity-50 cursor-not-allowed border-gray-400 text-gray-400'
                    } font-forum`}
                >
                  Request a Hint
                  <span className="block text-xs mt-1 font-serif text-gray-600 font-forum">
                    -30 Points
                  </span>
                </button>
              </div>
            </div>
              
            
            {hasWon ? (
              <VictoryDisplay score={score} attempts={attempts} isPractice={true} timeTaken={0}/>
            ) : hasLost ? (
              <GameOverDisplay word={currentWord} 
              attempts={attempts}
              onPlayAgain={handlePlayAgain}/>
            ) : (
              <>
                <div className="space-y-4 font-forum">
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
              </>
            )}
          </>
        )}
      </div>

      <HintConfirmationModal
        isOpen={showHintConfirmation}
        onConfirm={handleConfirmHint}
        onCancel={() => setShowHintConfirmation(false)}
      />
    </main>
  );
};

export default PracticePage;
