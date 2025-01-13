'use client';
export const fetchCache = 'force-no-store'

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
      <div className="flex items-center justify-center p-8 font-forum">
        <div className="text-xl font-forum">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 font-forum">
        <div className="text-xl text-red-500 font-forum">{error}</div>
      </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 font-forum">
        <div className="text-xl text-gray-500 font-forum">No leaderboard data available yet</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-forum">
      <h1 className="text-3xl font-bold mb-8 text-center font-forum">Leaderboard</h1>
      <div className="overflow-x-auto font-forum">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden font-forum">
          <thead className="bg-gray-100 font-forum">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 font-forum">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 font-forum">Player</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 font-forum">Total Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 font-forum">Games Won</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 font-forum">Win Rate</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 font-forum">Avg Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 font-forum">Avg Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-forum">
            {leaderboard.map((entry, index) => (
              <tr key={entry.email} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm text-gray-900 font-forum">{index + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 font-forum">{getUsername(entry.email)}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-forum">{entry.totalScore.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-forum">{`${entry.gamesWon}/${entry.totalGames}`}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-forum">{entry.winRate}%</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-forum">{entry.averageScore}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-forum">{formatTime(entry.averageTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
