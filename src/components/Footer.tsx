'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center mb-6">
          <h2 className="font-playfair italic text-2xl mb-3">Idelmer</h2>
          <p className="text-gray-600 text-sm font-serif">
            A daily word puzzle inspired by The New Yorker
          </p>
        </div>

        {/* Links */}
        <div className="flex justify-center space-x-6 mb-6 font-serif text-sm">
          <Link href="/leaderboard" className="text-gray-600 hover:text-black">
            Leaderboard
          </Link>
          <Link href="/how-to-play" className="text-gray-600 hover:text-black">
            How to Play
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black"
          >
            GitHub
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs font-serif">
          {currentYear} Idelmer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
