"use client";

import React from 'react';
//import { useSearchParams } from 'next/navigation';
import VictoryDisplay from '../../components/VictoryDisplay';

const SharePage = () => {
  // const searchParams = useSearchParams();
  // const score = searchParams.get('score');
  // const attempts = searchParams.get('attempts');
  // const timeSpent = searchParams.get('timeSpent');
  const score = 0;
  const attempts = 0;
  const timeSpent = 0;  

  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <VictoryDisplay 
          score={Number(score)} 
          attempts={Number(attempts)} 
          timeTaken={Number(timeSpent)} 
          isPractice={false} 
        />
      </div>
  );
};

export default SharePage;
