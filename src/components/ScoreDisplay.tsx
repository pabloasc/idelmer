'use client';

import React from 'react';

interface ScoreDisplayProps {
  attempts: number;
  score: number;
}

const ScoreDisplay = ({ attempts, score }: ScoreDisplayProps) => {
  return (
    <div className="flex flex-col items-center gap-2 font-serif">
      <div className="text-sm uppercase tracking-wide text-gray-600">Game Statistics</div>
      <div className="flex gap-8 mt-1">
        <div className="text-center">
          <div className="text-3xl font-bold">{attempts}</div>
          <div className="text-sm uppercase tracking-wider text-gray-600">
            {attempts === 1 ? 'Attempt' : 'Attempts'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{score}</div>
          <div className="text-sm uppercase tracking-wider text-gray-600">Score</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
