'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HintConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const HintConfirmationModal = ({ onConfirm, onCancel }: HintConfirmationModalProps) => {
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
        <h2 className="font-playfair italic text-2xl mb-6">Request a Hint?</h2>
        <p className="text-lg mb-8">
          This will deduct <span className="font-bold">25 points</span> from your score.
        </p>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="border-2 border-gray-300 px-6 py-2 text-sm uppercase tracking-wider
              transition-colors duration-200 hover:bg-gray-100"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="border-2 border-black px-6 py-2 text-sm uppercase tracking-wider
              transition-colors duration-200 hover:bg-black hover:text-white"
          >
            Confirm
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HintConfirmationModal;
