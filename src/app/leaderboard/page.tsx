'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/services/userService';

interface LeaderboardEntry {
  email: string;
  totalScore: number;
  totalGames: number;
  gamesWon: number;
  winRate: string;
  currentStreak: number;
  averageScore: number;
  averageTime: number;
  totalHints: number;
}

const getUsername = (email: string) => {
  return email.split('@')[0];
};

const formatTime = (seconds: number) => {
  if (seconds === 0) return '-';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0 
    ? `${minutes}m ${remainingSeconds}s`
    : `${remainingSeconds}s`;
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-gray-500">No leaderboard data available yet</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Player</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Games Won</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Win Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Streak</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Avg Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Avg Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Hints</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboard.map((entry, index) => (
              <tr key={entry.email} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{getUsername(entry.email)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.totalScore.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{`${entry.gamesWon}/${entry.totalGames}`}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.winRate}%</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.currentStreak}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.averageScore}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatTime(entry.averageTime)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.totalHints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
