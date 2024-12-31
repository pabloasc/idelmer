'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-playfair italic font-bold tracking-wide">
              Idelmer
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            {/* Desktop Links */}
            {user && (
              <Link 
                href="/" 
                className="hidden sm:block text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
              >
                Daily Word
              </Link>
            )}
            <Link 
              href="/practice" 
              className="hidden sm:block text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
            >
              Practice
            </Link>
            <Link 
              href="/leaderboard" 
              className="hidden sm:block text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
            >
              Leaderboard
            </Link>
            
            {user && (
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium"
                >
                  <span className="hidden sm:inline">{user.email}</span>
                  <svg 
                    className="h-5 w-5" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {/* Mobile Links */}
                  {user && (
                    <Link
                      href="/"
                      className="sm:hidden block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Daily Word
                    </Link>
                  )}
                  <Link
                    href="/practice"
                    className="sm:hidden block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Practice
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="sm:hidden block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Leaderboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
