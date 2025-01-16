"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface IntUser {
  id: string;
  email: string;
  username: string;
  language: string;
  totalScore?: number;
  totalGames?: number;
  gamesWon?: number;
  currentStreak?: number;
}

const SettingsPage = () => {
  const [userDB, setUser] = useState<IntUser | null>(null);
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('english');
  const { user: authUser, loading, signOut } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (loading) return; // Wait for the auth state to load
      try {
        if (!authUser) {
          throw new Error('User is not authenticated');
        }
        const response = await fetch(`/api/user?userId=${authUser.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
        setUsername(data.username);
        setLanguage(data.language);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [authUser, loading]);

  const handleSave = async () => {
    if (!userDB) return;
    try {
      const response = await fetch(`/api/user?userId=${userDB.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating user:', errorData);
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error in handleSave:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.replace('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24 font-forum">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm font-forum">
        {/* User Stats Section */}
        <div className="mt-8 p-6 border-t-2 border-b-2 border-black">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-center font-forum">{userDB?.totalScore || 0}</span>
              <span className="text-sm uppercase text-center tracking-wider text-gray-600 font-forum">Total Score</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-center font-forum">{userDB?.totalGames || 0}</span>
              <span className="text-sm uppercase text-center tracking-wider text-gray-600 font-forum">Games Played</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-center font-forum">{userDB?.gamesWon || 0}</span>
              <span className="text-sm uppercase text-center tracking-wider text-gray-600 font-forum">Victories</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-center font-forum">{userDB?.currentStreak || 0}</span>
              <span className="text-sm uppercase text-center tracking-wider text-gray-600 font-forum">Current Streak</span>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="text-center mb-8 font-forum">
          <h1 className="text-4xl font-bold mb-4 font-forum">Settings</h1>
        </div>
        <div className="max-w-2xl mx-auto mb-12 space-y-8 font-forum">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                if (e.target.value.length <= 25) {
                  setUsername(e.target.value);
                }
              }}
              placeholder={userDB?.username || userDB?.email.split('@')[0]}
              className="mt-1 block w-full px-4 py-2 border-2 border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-forum"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={userDB?.email || ''}
              readOnly
              className="mt-1 block w-full px-4 py-2 border-2 border-black rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-forum"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Preferred Language (beta)</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border-2 border-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-forum"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
            </select>
          </div>
          <div className="flex justify-between space-x-4">
            <button
              onClick={handleSave}
              className="w-full max-w-xs border-2 border-black px-6 py-2 text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-black hover:text-white font-forum"
            >
              Save Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full max-w-xs border-2 border-black px-6 py-2 text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-red-500 hover:text-white font-forum"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
