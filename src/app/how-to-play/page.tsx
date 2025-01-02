'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-newyorker-white py-12">
      <motion.div 
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-forum italic font-bold mb-4">How to Play</h1>
          <p className="text-gray-600 font-serif">
            Master the art of word discovery with our elegant puzzle game
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div variants={itemVariants} className="space-y-12">
          {/* Objective */}
          <div className="prose prose-lg mx-auto">
            <h2 className="font-forum text-2xl mb-4">Objective</h2>
            <p className="font-serif text-gray-700">
              Guess the daily word in as few attempts as possible. Each day brings a new word challenge.
            </p>
          </div>

          {/* Rules */}
          <div className="prose prose-lg mx-auto">
            <h2 className="font-forum text-2xl mb-4">Rules</h2>
            <ul className="font-serif text-gray-700 space-y-4">
              <li>You have unlimited attempts to guess the word</li>
              <li>You can use hints, but they will cost you points</li>
              <li>You win by either:
                <ul className="ml-6 mt-2 space-y-2">
                  <li>Guessing the word correctly</li>
                  <li>Revealing all letters through hints or guesses</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Scoring */}
          <div className="prose prose-lg mx-auto">
            <h2 className="font-forum text-2xl mb-4">Scoring</h2>
            <ul className="font-serif text-gray-700 space-y-4">
              <li>Start with 100 points</li>
              <li>Lose 20 points for each incorrect guess</li>
              <li>Lose 25 points when using a hint</li>
              <li>The game ends when you:
                <ul className="ml-6 mt-2 space-y-2">
                  <li>Guess the word correctly</li>
                  <li>Reveal all letters through hints or guesses</li>
                  <li>Run out of points</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Tips */}
          <div className="prose prose-lg mx-auto">
            <h2 className="font-forum text-2xl mb-4">Tips for Success</h2>
            <ul className="font-serif text-gray-700 space-y-4">
              <li>The letters have unique patterns</li>
              <li>Use hints strategically when stuck</li>
              <li>Track your progress on the leaderboard</li>
            </ul>
          </div>
        </motion.div>

        {/* Start Playing Button */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-12"
        >
          <Link
            href="/"
            className="inline-block border-2 border-black px-8 py-3 text-sm uppercase tracking-wider
              transition-colors duration-200 hover:bg-black hover:text-white font-serif"
          >
            Start Playing
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
