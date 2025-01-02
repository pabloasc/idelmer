'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

export default function Header() {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-md relative z-50 border-b-4 border-black font-forum">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex flex-col items-center">
            <Link href="/" className="text-3xl sm:text-4xl font-extrabold tracking-wide text-black">
              IDELMER
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <div className="sm:hidden">
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
              className="hidden sm:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
            >
              How to Play
            </Link>
            <Link 
              href="/" 
              className="hidden sm:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
            >
              Daily Word
            </Link>
            <Link 
              href="/practice" 
              className="hidden sm:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
            >
              Practice
            </Link>
            <Link 
              href="/leaderboard" 
              className="hidden sm:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
            >
              Leaderboard
            </Link>
            {user && (
              <button
                onClick={() => signOut()}
                className="hidden sm:block text-black hover:text-gray-700 px-3 py-2 rounded-md text-base font-semibold"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
        {isMobileMenuOpen && (
          <div className="sm:hidden">
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
              {user && (
                <button
                  onClick={() => signOut()}
                  className="block px-3 py-2 rounded-md text-base font-semibold text-black hover:text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
