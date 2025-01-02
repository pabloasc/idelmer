import React from 'react';
import { useRouter } from 'next/router';
import VictoryDisplay from '../../components/VictoryDisplay';

const SharePage = () => {
  const router = useRouter();
  const { score, timeSpent, attempts } = router.query;

  // Convert query parameters to numbers
  const parsedScore = parseInt(score as string, 10) || 0;
  const parsedTimeSpent = parseInt(timeSpent as string, 10) || 0;
  const parsedAttempts = parseInt(attempts as string, 10) || 0;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <VictoryDisplay 
        score={parsedScore} 
        timeTaken={parsedTimeSpent} 
        attempts={parsedAttempts} 
        isPractice={false} 
      />
    </div>
  );
};

export default SharePage;
