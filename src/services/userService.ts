import { User } from '@supabase/supabase-js';

export async function createOrUpdateUser(supabaseUser: User) {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: supabaseUser.id,
      email: supabaseUser.email,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create/update user');
  }

  return response.json();
}

export async function updateUserStats(userId: string, won: boolean) {
  const response = await fetch('/api/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      won,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update user stats');
  }

  return response.json();
}

export const createOrUpdateScore = async (
  userId: string,
  wordId: number,
  score: number,
  attempts: number,
  won: boolean,
  lost: boolean,
  lastGuess?: string,
  revealedLetters?: string[]
) => {
  try {
    const response = await fetch('/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        wordId,
        score,
        attempts,
        won,
        lost,
        lastGuess,
        revealedLetters,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update score');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
};

export async function getUserStats(userId: string) {
  const response = await fetch(`/api/score?userId=${encodeURIComponent(userId)}`);

  if (!response.ok) {
    throw new Error('Failed to get user stats');
  }

  return response.json();
}

export async function getLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}
