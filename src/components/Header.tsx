'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/user?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch username');
        }
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-md relative z-50 border-b-4 border-black font-forum">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex flex-col items-center">
            <Link href="/" className="text-3xl sm:text-4xl font-extrabold tracking-wide text-black">
              <img src="/logo.png" alt="Idelmer Logo" className="h-12 w-auto object-contain" />
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <div className="md:hidden">
              <button
                className="text-black hover:text-gray-700 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            <Link 
              href="/how-to-play" 
              className="hidden md:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
            >
              How to Play
            </Link>
            <Link 
              href="/" 
              className="hidden md:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
            >
              Daily Word
            </Link>
            <Link 
              href="/practice" 
              className="hidden md:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
            >
              Practice
            </Link>
            <Link 
              href="/leaderboard" 
              className="hidden md:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
            >
              Leaderboard
            </Link>
            {!user && (
              <Link
                href="/"
                className="hidden md:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
              >
                Sign In
              </Link>
            )}
            {user && username && (
              <Link href="/settings" className="hidden md:block text-fuchsia-800 hover:text-fuchsia-600 px-3 py-2 rounded-md text-base font-semibold">
                {username}
              </Link>
            )}
          </nav>
        </div>
        {isMobileMenuOpen && (
          <div ref={menuRef} className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/how-to-play"
                className="block px-3 py-2 rounded-md text-base font-semibold text-black hover:text-gray-700 hover:bg-gray-100"
              >
                How to Play
              </Link>
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-semibold text-black hover:text-gray-700 hover:bg-gray-100"
              >
                Daily Word
              </Link>
              <Link
                href="/practice"
                className="block px-3 py-2 rounded-md text-base font-semibold text-black hover:text-gray-700 hover:bg-gray-100"
              >
                Practice
              </Link>
              <Link
                href="/leaderboard"
                className="block px-3 py-2 rounded-md text-base font-semibold text-black hover:text-gray-700 hover:bg-gray-100"
              >
                Leaderboard
              </Link>
              {!user && (
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-semibold text-black hover:text-gray-700 hover:bg-gray-100"
                >
                  Sign In
                </Link>
              )}
              {user && username && (
                <Link href="/settings" className="block px-3 py-2 rounded-md text-base font-semibold text-fuchsia-800 hover:text-fuchsia-600 hover:text-gray-700 hover:bg-gray-100">
                  {username}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
