"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const [user, setUser] = useState<{ id: string; email: string; username: string; language: string } | null>(null);
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('english');
  const { user: authUser, loading } = useAuth();

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
    if (!user) return;
    try {
      const response = await fetch(`/api/user?userId=${user.id}`, {
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {user && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={user?.username || user?.email.split('@')[0]}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;
