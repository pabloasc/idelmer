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
        <h2 className="font-playfair italic text-4xl mb-6">Game Over</h2>
        <div className="space-y-4 mb-8">
          <p className="text-xl">The word was:</p>
          <p className="text-3xl font-bold font-serif">{word}</p>
          <div className="text-center mt-6">
            <div className="text-3xl font-bold">{attempts}</div>
            <div className="text-sm uppercase tracking-wider text-gray-600">
              {attempts === 1 ? 'Attempt' : 'Attempts'}
            </div>
          </div>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <button 
            onClick={onPlayAgain}
            className="w-full border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
              transition-colors duration-200 hover:bg-black hover:text-white"
          >
            Try Again
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverDisplay;
