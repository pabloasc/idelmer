'use client';

import { useState, useEffect } from 'react';
import WordDisplay from '@/components/WordDisplay';
import ScoreDisplay from '@/components/ScoreDisplay';
import VictoryDisplay from '@/components/VictoryDisplay';
import GameOverDisplay from '@/components/GameOverDisplay';
import HintConfirmationModal from '@/components/HintConfirmationModal';
import { useAuth } from '@/contexts/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import { createOrUpdateScore, updateUserStats } from '@/services/userService';

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
  const { user, loading, signOut } = useAuth();
  const [currentWord, setCurrentWord] = useState('');
  const [currentWordId, setCurrentWordId] = useState<number | null>(null);
  const [guesses, setGuesses] = useState<GuessState[]>([]);
  const [letterColors, setLetterColors] = useState({});
  const [attempts, setAttempts] = useState(1);
  const [score, setScore] = useState(100);
  const [error, setError] = useState('');
  const [hasWon, setHasWon] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [showHintConfirmation, setShowHintConfirmation] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const fetchDailyWord = async () => {
    try {
      const response = await fetch('/api/daily-word');
      if (!response.ok) throw new Error('Failed to fetch daily word');
      
      const data = await response.json();
      if (!data.word) throw new Error('No word received from API');
      
      const newWord = data.word.toUpperCase();
      setCurrentWord(newWord);
      setCurrentWordId(data.id);
      setLetterColors(generateColors(newWord));

      // Get existing game state if it exists
      if (user) {
        const scoreResponse = await fetch(`/api/score?wordId=${data.id}`);
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json();
          if (scoreData) {
            // Reconstruct the game state
            const allLetters = new Set(newWord.toLowerCase().split(''));
            const revealedLetters = new Set();

            // Add all revealed letters
            newWord.toLowerCase().split('').forEach((letter, index) => {
              if (scoreData.revealedLetters?.includes(letter)) {
                revealedLetters.add(letter);
              }
            });

            setScore(scoreData.score);
            setAttempts(scoreData.attempts);
            setHasWon(scoreData.won);
            setHasLost(scoreData.lost);

            // Check if all letters are revealed
            const allLettersRevealed = Array.from(allLetters).every(letter => 
              revealedLetters.has(letter)
            );

            if (allLettersRevealed || scoreData.won) {
              setGuesses([{
                guess: scoreData.lastGuess || '',
                revealedLetters: allLetters
              }]);
            } else {
              setGuesses([{
                guess: scoreData.lastGuess || '',
                revealedLetters
              }]);
            }
            return;
          }
        }
      }
      
      // If no existing game state, start a new game
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
      
      setError('');
    } catch (err) {
      console.error('Error fetching daily word:', err);
      setError(err instanceof Error ? err.message : 'Failed to load today\'s word');
    }
  };

  useEffect(() => {
    const fetchWithRetry = async (retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          await fetchDailyWord();
          return; // Success, exit retry loop
        } catch (error) {
          console.error(`Attempt ${i + 1} failed:`, error);
          if (i < retries - 1) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      // All retries failed
      setError('Unable to load today\'s word after multiple attempts. Please try again later.');
    };

    fetchWithRetry();
  }, []);

  useEffect(() => {
    if (user && !currentWord) {
      fetchDailyWord();
      setStartTime(Date.now()); // Reset time when new word is fetched
    }
  }, [user]);

  const handleGuess = async (guess: string) => {
    if (!currentWord || hasWon || hasLost || !user || !currentWordId) return;
    
    const currentGuessState = guesses[guesses.length - 1];
    const isCorrect = guess.toLowerCase() === currentWord.toLowerCase();
    const allLetters = new Set(currentWord.toLowerCase().split(''));
    
    // Check if all letters are revealed
    const allLettersRevealed = Array.from(allLetters).every(letter => 
      currentGuessState.revealedLetters.has(letter)
    );
    
    const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    if (isCorrect || allLettersRevealed) {
      setGuesses(prev => [
        ...prev.slice(0, -1),
        { guess: isCorrect ? guess : prev[prev.length - 1].guess, revealedLetters: allLetters }
      ]);
      setHasWon(true);
      // Save score and update user stats
      await Promise.all([
        createOrUpdateScore(
          currentWordId,
          score,
          attempts,
          true,
          timeTaken,
          0  // hintsUsed
        ),
        updateUserStats(user.id, true)
      ]).catch(console.error);
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
    
    // Check if all letters are revealed after this guess
    const allLettersRevealedAfterGuess = Array.from(allLetters).every(letter => 
      newRevealed.has(letter)
    );
    
    if (allLettersRevealedAfterGuess) {
      setGuesses(prev => [
        ...prev.slice(0, -1),
        { guess, revealedLetters: allLetters }
      ]);
      setHasWon(true);
      // Save score and update user stats
      await Promise.all([
        createOrUpdateScore(
          currentWordId,
          newScore,
          newAttempts,
          true,
          timeTaken,
          0  // hintsUsed
        ),
        updateUserStats(user.id, true)
      ]).catch(console.error);
      return;
    }
    
    setGuesses(prev => [
      ...prev.slice(0, -1),
      { guess, revealedLetters: prev[prev.length - 1].revealedLetters },
      { guess: '', revealedLetters: newRevealed }
    ]);
    
    // Update score in database
    try {
      await createOrUpdateScore(
        currentWordId,
        newScore,
        newAttempts,
        false,
        timeTaken,
        0  // hintsUsed
      );
      
      if (newScore === 0) {
        setHasLost(true);
        await updateUserStats(user.id, false);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleHint = () => {
    if (!currentWord || score <= 0 || hasWon || hasLost || !user || !currentWordId) return;
    setShowHintConfirmation(true);
  };

  const confirmHint = async () => {
    if (!currentWord || !user || !currentWordId) return;
    
    setShowHintConfirmation(false);
    
    const currentRevealedLetters = guesses[guesses.length - 1].revealedLetters;
    const unrevealedLetters = currentWord.toLowerCase().split('')
      .filter(letter => !currentRevealedLetters.has(letter));

    if (unrevealedLetters.length === 0) return;

    const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
    const newRevealed = new Set(currentRevealedLetters);
    newRevealed.add(randomLetter);

    const allLetters = new Set(currentWord.toLowerCase().split(''));
    const allLettersRevealed = Array.from(allLetters).every(letter => 
      newRevealed.has(letter)
    );

    setGuesses(prev => [
      ...prev.slice(0, -1),
      { ...prev[prev.length - 1], revealedLetters: newRevealed }
    ]);

    const newScore = Math.max(0, score - 25);
    setScore(newScore);

    const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    // Update score in database
    try {
      await createOrUpdateScore(
        currentWordId,
        newScore,
        attempts,
        allLettersRevealed,
        timeTaken,
        1  // increment hintsUsed when using a hint
      );
      
      if (newScore === 0) {
        setHasLost(true);
        await updateUserStats(user.id, false);
      } else if (allLettersRevealed) {
        setHasWon(true);
        await updateUserStats(user.id, true);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-newyorker-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-xl text-center">Loading...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return <SignInForm />;
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

  if (!currentWord) {
    return (
      <main className="min-h-screen bg-newyorker-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-xl text-center">Loading today's word...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-newyorker-white">
      <div className="container mx-auto px-4 py-8">
        {/* Game Controls Section */}
        <div className="max-w-2xl mx-auto mb-12 space-y-8">
          <ScoreDisplay attempts={attempts} score={score} />
          
          <div className="flex justify-center">
            <button
              onClick={handleHint}
              disabled={score <= 0 || hasWon || hasLost}
              className={`
                border-2 border-black px-6 py-3 text-sm uppercase tracking-wider
                transition-colors duration-200 rounded-lg shadow-sm
                ${score > 0 && !hasWon && !hasLost
                  ? 'hover:bg-black hover:text-white'
                  : 'opacity-50 cursor-not-allowed border-gray-400 text-gray-400'
                }
              `}
            >
              Request a Hint
              <span className="block text-xs mt-1 font-serif text-gray-600">
                -25 Points
              </span>
            </button>
          </div>
        </div>
        
        {/* Game Board Section */}
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-4">
            {guesses.map((guessState, index) => (
              <WordDisplay
                key={index}
                word={currentWord}
                revealedLetters={guessState.revealedLetters}
                letterColors={letterColors}
                onGuess={!hasWon && !hasLost && index === guesses.length - 1 ? handleGuess : undefined}
                guess={guessState.guess}
                isActive={!hasWon && !hasLost && index === guesses.length - 1}
              />
            ))}
          </div>

          {hasWon && (
            <div className="mt-12">
              <VictoryDisplay score={score} attempts={attempts} />
            </div>
          )}

          {hasLost && (
            <div className="mt-12">
              <GameOverDisplay
                word={currentWord}
                attempts={attempts}
                onPlayAgain={handlePlayAgain}
              />
            </div>
          )}
        </div>

        {showHintConfirmation && (
          <HintConfirmationModal
            onConfirm={confirmHint}
            onCancel={() => setShowHintConfirmation(false)}
          />
        )}
      </div>
    </main>
  );
}
