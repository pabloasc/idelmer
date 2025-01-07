'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto font-forum">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center mb-6 font-forum">
          <h2 className="font-playfair italic text-2xl mb-3 font-forum">Idelmer</h2>
          <p className="text-gray-600 text-sm font-forum">
            Stay Curious. Stay Clever. Play Idelmer.
          </p>
        </div>

        {/* Links */}
        <div className="flex justify-center space-x-6 mb-6 font-forum text-sm">
          <Link href="/leaderboard" className="text-gray-600 hover:text-black font-forum">
            Leaderboard
          </Link>
          <Link href="/how-to-play" className="text-gray-600 hover:text-black font-forum">
            How to Play
          </Link>
          <Link href="/privacy-policy" className="text-gray-600 hover:text-black font-forum">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="text-gray-600 hover:text-black font-forum">
            Terms and Conditions
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs font-forum">
          {currentYear} Idelmer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
