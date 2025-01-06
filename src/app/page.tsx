'use client';

import { useState, useEffect } from 'react';
import WordDisplay from '@/components/WordDisplay';
import ScoreDisplay from '@/components/ScoreDisplay';
import VictoryDisplay from '@/components/VictoryDisplay';
import GameOverDisplay from '@/components/GameOverDisplay';
import HintConfirmationModal from '@/components/HintConfirmationModal';
import { useAuth } from '@/contexts/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import { createOrUpdateScore } from '@/services/userService';
import Link from 'next/link';
import Head from 'next/head';
import { generateColors } from '@/utils/generateColors';

interface GuessState {
  guess: string;
  revealedLetters: Set<string>;
}

const Home = () => {
  const { user, loading } = useAuth();
  const [currentWord, setCurrentWord] = useState<string>('');
  const [currentWordId, setCurrentWordId] = useState<number>(0);
  const [guesses, setGuesses] = useState<GuessState[]>([]);
  const [letterColors, setLetterColors] = useState<{ [key: string]: string }>({});
  const [attempts, setAttempts] = useState<number>(1);
  const [score, setScore] = useState<number>(100);
  const [error, setError] = useState<string>('');
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showHintConfirmation, setShowHintConfirmation] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showNextWordModal, setShowNextWordModal] = useState(false);

  const fetchDailyWord = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/daily-word?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch daily word');
      
      const data = await response.json();
      
      if (data.userScore) {
        setShowNextWordModal(true);
        return;
      }
      
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
            // Initialize sets for revealed letters
            const revealedLetters = new Set<string>();

            // Add all revealed letters
            newWord.toLowerCase().split('').forEach((letter: string) => {
              if (scoreData.revealedLetters?.includes(letter)) {
                revealedLetters.add(letter);
              }
            });

            setScore(scoreData.score);
            setAttempts(scoreData.attempts);
            setHasWon(scoreData.won);
            setHasLost(scoreData.lost);

            // Check if all letters are revealed
            const allLettersRevealed = Array.from(newWord.toLowerCase()).every(letter => 
              revealedLetters.has(letter as string)
            );

            if (allLettersRevealed) {
              setHasWon(true);
            }
          }
        }
      }
      
      // If no existing game state, start a new game
      // Reveal a repeated letter
      const letterCounts: { [key: string]: number } = {};
      newWord.toLowerCase().split('').forEach((letter: string) => {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      });
      
      // eslint-disable-next-line
      const repeatedLetter = Object.keys(letterCounts)
        .find(letter => letterCounts[letter] > 1);
        
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
      if (!user) return; // Don't fetch if user is not logged in
      
      for (let i = 0; i < retries; i++) {
        try {
          await fetchDailyWord();
          setStartTime(Date.now()); // Reset time when new word is fetched
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

    if (user && (!currentWord || !startTime)) {
      fetchWithRetry();
    }
  }, [user]); // Add user as dependency

  const updateScore = async (won: boolean) => {
    const timeTaken = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    try {
      await createOrUpdateScore({
        wordId: currentWordId,
        score: score,
        attempts: attempts,
        won: won,
        timeTaken: timeTaken,
        hintsUsed: hintsUsed,
      });

      if (score === 0) {
        setHasLost(true);
      } else if (won) {
        setHasWon(true);
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleGuess = async (guess: string) => {
    if (!currentWord || hasWon || hasLost || !user || !currentWordId) return;
    
    const currentGuessState = guesses[guesses.length - 1];
    const isCorrect = guess.toLowerCase() === currentWord.toLowerCase();
    const allLetters = new Set(currentWord.toLowerCase().split(''));
    
    // Check if all letters are revealed
    const allLettersRevealed = Array.from(allLetters).every(letter => 
      currentGuessState.revealedLetters.has(letter as string)
    );
    
    if (isCorrect || allLettersRevealed) {
      setGuesses(prev => [
        ...prev.slice(0, -1),
        { guess: isCorrect ? guess : prev[prev.length - 1].guess, revealedLetters: allLetters }
      ]);
      setHasWon(true);
      // Save score and update user stats
      await updateScore(true);
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
    
    // Check if all letters are revealed after this guess
    const allLettersRevealedAfterGuess = Array.from(allLetters).every(letter => 
      newRevealed.has(letter as string)
    );
    
    if (allLettersRevealedAfterGuess) {
      setGuesses(prev => [
        ...prev.slice(0, -1),
        { guess, revealedLetters: allLetters }
      ]);
      setHasWon(true);
      // Save score and update user stats
      await updateScore(true);
      return;
    }
    
    setGuesses(prev => [
      ...prev.slice(0, -1),
      { guess, revealedLetters: prev[prev.length - 1].revealedLetters },
      { guess: '', revealedLetters: newRevealed }
    ]);
    
    if (newScore === 0) {
      setHasLost(true);
      await updateScore(false);
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
      newRevealed.has(letter as string)
    );

    setGuesses(prev => [
      ...prev.slice(0, -1),
      { ...prev[prev.length - 1], revealedLetters: newRevealed, guess: '' }
    ]);

    const newScore = Math.max(0, score - 30);
    setScore(newScore);
    setHintsUsed(prev => prev + 1);

    // Update score in database
    if (allLettersRevealed) {
      setHasWon(true);
      await updateScore(true);
      return;
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Idelmer - Stay Curious. Stay Clever. Play Idelmer.</title>
        <meta name="description" content="Join our daily challenge word puzzle to test your skills and improve your vocabulary. Play now and enjoy a new word puzzle every day!" />
        <meta name="keywords" content="word puzzle, daily challenge, vocabulary game, word game, puzzle game" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 font-forum">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-forum text-sm">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : user ? (
            <div>
              {showNextWordModal ? (
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-4">You&#39;ve already played today&#39;s challenge!</h1>
                  <p className="text-gray-600 mb-6">
                    Come back tomorrow for a new word. In the meantime, you can practice with random words in our practice mode.
                  </p>
                  <Link
                    href="/practice"
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg text-center hover:bg-green-600 transition-colors font-forum"
                  >
                    Go to Practice Area
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Daily word</h1>
                    <p className="text-gray-600">Challenge yourself to guess the daily word</p>
                  </div>
                  <div className="max-w-2xl mx-auto mb-12 space-y-8 font-forum">
                    {/* Game Controls Section */}
                    <div className="max-w-2xl mx-auto mb-12 space-y-8 font-forum">
                      <ScoreDisplay attempts={attempts} score={score} />
                      
                      <div className="flex justify-center font-forum">
                        <button
                          onClick={handleHint}
                          disabled={score <= 0 || hasWon || hasLost || score <= 30}
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
                          <VictoryDisplay 
                            score={score} 
                            attempts={attempts} 
                            timeTaken={startTime ? Math.floor((Date.now() - startTime) / 1000) : 0} 
                            isPractice={false} 
                          />
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

                    <HintConfirmationModal
                      isOpen={showHintConfirmation}
                      onConfirm={confirmHint}
                      onCancel={() => setShowHintConfirmation(false)}
                    />
                    
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-col gap-4 w-full max-w-md">
              <Link
                  href="/practice"
              className={`w-full px-6 py-3 border-2 border-black text-sm uppercase text-center
                transition-colors duration-200 ${
                  true
                    ? 'hover:bg-black hover:text-white'
                    : 'opacity-50 cursor-not-allowed border-gray-400 text-gray-400'
                } font-forum`}
            >
                  Practice Area
                </Link>
                <div className="text-center text-gray-500">- or -</div>
                <SignInForm />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}
      </main>
    </>
  );
}

export default Home;
