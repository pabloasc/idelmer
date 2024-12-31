'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HintConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const HintConfirmationModal = ({ isOpen, onConfirm, onCancel }: HintConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4"
      >
        <h2 className="font-playfair italic text-2xl mb-6">Use a Hint?</h2>
        <p className="text-lg mb-4">
          This will reveal a random letter and cost you 25 points.
        </p>
        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={onConfirm}
            className="w-full border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
              transition-colors duration-200 hover:bg-black hover:text-white"
          >
            Yes, Use Hint
          </button>
          <button
            onClick={onCancel}
            className="w-full border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
              transition-colors duration-200 hover:bg-black hover:text-white"
          >
            No, Keep Playing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HintConfirmationModal;
