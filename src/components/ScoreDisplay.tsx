'use client';

import React from 'react';

interface ScoreDisplayProps {
  attempts: number;
  score: number;
}

const ScoreDisplay = ({ attempts, score }: ScoreDisplayProps) => {
  return (
    <div className="text-center font-serif">
      <p className="text-lg">Attempts: {attempts}</p>
      <p className="text-lg mt-2">Score: {score}</p>
    </div>
  );
};

export default ScoreDisplay;
