"use client";

import React, { useState } from "react";

export default function GuestPlayForm({ onPlay }: { onPlay: (guestName: string) => void }) {
  const [guestName, setGuestName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    onPlay(guestName.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-2 border-black p-6 shadow-md bg-white">
      <h2 className="text-center text-2xl font-bold">Play as Guest</h2>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <input
        type="text"
        placeholder="Enter your name"
        value={guestName}
        onChange={e => setGuestName(e.target.value)}
        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
      />
      <button
        type="submit"
        className="w-full px-6 py-2 border-2 border-black text-sm uppercase tracking-wider transition-colors duration-200 hover:bg-black hover:text-white font-forum"
      >
        Play as Guest
      </button>
    </form>
  );
}
