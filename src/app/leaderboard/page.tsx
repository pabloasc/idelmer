'use client';
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderboardEntry {
  username: string;
  score: number;
  attempts: number;
  timeTaken: number;
  date?: string;
}

interface AllTimeLeaderboardEntry {
  username: string;
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
}

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'allTime'>('daily');
  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeLeaderboard, setAllTimeLeaderboard] = useState<AllTimeLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch daily leaderboard with no-cache headers
        const dailyResponse = await fetch('/api/leaderboard/daily', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          next: {
            revalidate: 0
          }
        });
        if (!dailyResponse.ok) {
          throw new Error(`Daily leaderboard error: ${dailyResponse.statusText}`);
        }
        const dailyData = await dailyResponse.json();
        console.log('Daily leaderboard data:', dailyData);
        setDailyLeaderboard(dailyData);

        // Fetch all-time leaderboard with no-cache headers
        const allTimeResponse = await fetch('/api/leaderboard/all-time', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          next: {
            revalidate: 0
          }
        });
        if (!allTimeResponse.ok) {
          throw new Error(`All-time leaderboard error: ${allTimeResponse.statusText}`);
        }
        const allTimeData = await allTimeResponse.json();
        console.log('All-time leaderboard data:', allTimeData);
        setAllTimeLeaderboard(allTimeData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();

    // Set up an interval to refresh the data every 30 seconds
    const intervalId = setInterval(fetchLeaderboards, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const renderLeaderboard = (entries: LeaderboardEntry[]) => {
    if (entries.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 font-forum">
            {activeTab === 'daily' 
              ? "No games have been completed today yet. Be the first one!"
              : "No games have been completed yet. Start playing to appear here!"}
          </p>
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full font-forum">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Attempts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Time</th>
                {activeTab === 'allTime' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Date</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry, index) => (
                <tr key={index} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-forum">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{entry.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{entry.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{entry.attempts}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{formatTime(entry.timeTaken)}</td>
                  {activeTab === 'allTime' && entry.date && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAllTimeLeaderboard = (entries: AllTimeLeaderboardEntry[]) => {
    if (entries.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 font-forum">
            No players have completed any games yet. Start playing to appear here!
          </p>
        </div>
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full font-forum">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Total Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Games Won</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Games Played</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-forum">Current Streak</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry, index) => (
                <tr key={index} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-forum">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{entry.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{entry.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{entry.gamesWon}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{entry.gamesPlayed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-forum">{entry.currentStreak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center">
        <div className="mt-12 mb-16">
          <img 
            src="/images/idelmer_main.png"
            alt="Idelmer Game Logo"
            width={250}
            height={120}
            className="mx-auto"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 font-forum">Leaderboard</h1>
          <p className="text-gray-600 font-forum">See who&apos;s leading the pack!</p>
        </div>

        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-6 py-2 text-sm uppercase tracking-wider font-forum border-2 transition-colors duration-200
                ${activeTab === 'daily' 
                  ? 'bg-black text-white border-black' 
                  : 'border-black hover:bg-black hover:text-white'}`}
            >
              Today&apos;s Best
            </button>
            <button
              onClick={() => setActiveTab('allTime')}
              className={`px-6 py-2 text-sm uppercase tracking-wider font-forum border-2 transition-colors duration-200
                ${activeTab === 'allTime' 
                  ? 'bg-black text-white border-black' 
                  : 'border-black hover:bg-black hover:text-white'}`}
            >
              All Time Best
            </button>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500 font-forum">{error}</p>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 font-forum">Loading leaderboard...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'daily' 
                  ? renderLeaderboard(dailyLeaderboard)
                  : renderAllTimeLeaderboard(allTimeLeaderboard)
                }
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
