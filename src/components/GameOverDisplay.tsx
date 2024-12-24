'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GameOverDisplayProps {
  word: string;
  attempts: number;
  onPlayAgain: () => void;
}

const GameOverDisplay = ({ word, attempts, onPlayAgain }: GameOverDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-newyorker-white p-8 rounded-lg shadow-xl max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-playfair font-bold mb-4">Game Over</h2>
        <div className="space-y-4 mb-8">
          <p className="text-xl">Better luck next time!</p>
          <p className="text-lg">The word was: <span className="font-bold">{word}</span></p>
          <div className="flex justify-center gap-8 my-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{attempts}</div>
              <div className="text-sm uppercase tracking-wider text-gray-600">
                {attempts === 1 ? 'Attempt' : 'Attempts'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm uppercase tracking-wider text-gray-600">Final Score</div>
            </div>
          </div>
        </div>
        <button
          onClick={onPlayAgain}
          className="border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
            transition-colors duration-200 hover:bg-black hover:text-white"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GameOverDisplay;
