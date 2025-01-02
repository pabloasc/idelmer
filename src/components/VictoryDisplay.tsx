'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface VictoryDisplayProps {
  score: number;
  attempts: number;
  timeTaken: number;
  isPractice?: boolean;
}

const VictoryDisplay = ({ score, attempts, timeTaken, isPractice = false }: VictoryDisplayProps) => {
  const getMessage = () => {
    if (score === 100) {
      return {
        title: "Perfect!",
        subtitle: "Flawless victory on your first try!"
      };
    } else if (score >= 75) {
      return {
        title: "Magnificent!",
        subtitle: "An excellent performance!"
      };
    } else if (score >= 50) {
      return {
        title: "Well Done!",
        subtitle: "A solid effort!"
      };
    } else {
      return {
        title: "Good Job!",
        subtitle: "You solved it!"
      };
    }
  };

  const message = getMessage();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const shareUrl = `https://idelmer.com/share?score=${score}&timeSpent=${timeTaken}&attempts=${attempts}`;

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
        <h2 className="font-playfair italic text-4xl mb-6">{message.title}</h2>
        <div className="space-y-4 mb-8">
          <p className="text-xl">{message.subtitle}</p>
          <div className="flex justify-center gap-8 my-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{score}</div>
              <div className="text-sm uppercase tracking-wider text-gray-600">Final Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{attempts}</div>
              <div className="text-sm uppercase tracking-wider text-gray-600">
                {attempts === 1 ? 'Attempt' : 'Attempts'}
              </div>
            </div>
            {!isPractice && (
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(timeTaken)}</div>
                <div className="text-sm uppercase tracking-wider text-gray-600">Time Spent</div>
              </div>
            )}
          </div>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="space-y-4"
        >
          {!isPractice && (
            <div className="flex justify-center space-x-4">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
              </a>
              <a href={`https://api.whatsapp.com/send?text=Check%20out%20my%20score%20on%20Idelmer!%20${encodeURIComponent(shareUrl)}`} target="_blank" className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.76-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.173.198-.297.298-.496.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.208-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.793.372-.273.297-1.04 1.016-1.04 2.48 0 1.463 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.073 4.487.709.306 1.262.489 1.693.625.711.226 1.357.194 1.868.118.57-.085 1.758-.719 2.007-1.413.248-.694.248-1.29.173-1.413-.074-.124-.273-.198-.57-.347m-5.421 7.618h-.002C6.403 22 2 17.598 2 12.001 2 6.403 6.403 2 11.999 2 17.598 2 22 6.403 22 12c0 1.939-.504 3.838-1.463 5.501l-.976 1.636-1.732-.453c-.947-.248-1.79-.579-2.512-.988l-.342-.195-1.672.443z" /></svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20score%20on%20Idelmer!%20${encodeURIComponent(shareUrl)}`} target="_blank" className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.633 7.997c.013.18.013.36.013.54 0 5.486-4.176 11.81-11.81 11.81-2.345 0-4.523-.684-6.35-1.864.33.038.644.051.987.051 1.944 0 3.732-.66 5.15-1.764-1.818-.038-3.354-1.23-3.882-2.872.253.038.506.064.772.064.372 0 .746-.051 1.094-.139-1.894-.38-3.322-2.054-3.322-4.066v-.051c.556.31 1.18.497 1.852.523-1.1-.735-1.818-1.99-1.818-3.41 0-.746.198-1.442.556-2.042 2.03 2.5 5.067 4.145 8.48 4.32-.064-.31-.102-.635-.102-.96 0-2.347 1.9-4.248 4.248-4.248 1.224 0 2.33.51 3.104 1.33.97-.198 1.852-.548 2.66-1.03-.31.97-.97 1.764-1.83 2.272.87-.102 1.7-.335 2.474-.67-.58.86-1.3 1.612-2.14 2.22z" /></svg>
              </a>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="w-full border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
              transition-colors duration-200 hover:bg-black hover:text-white"
          >
            {isPractice ? 'Play Again' : 'Close'}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VictoryDisplay;
