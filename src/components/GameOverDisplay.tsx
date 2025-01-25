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
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div 
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4"
      >
        <div className="mb-8">
          <img 
            src="/images/idelmer_lost.png"
            alt="Game Over"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-bold mb-4 font-forum">Game Over</h2>
          <p className="text-xl mb-6 font-forum">The word was: <strong>{word}</strong></p>
          <p className="text-lg text-gray-600 mb-6 p-2 font-forum">
            You used {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onPlayAgain}
            className="border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
              transition-colors duration-200 hover:bg-black hover:text-white font-forum"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverDisplay;
