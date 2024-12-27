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

export async function createOrUpdateScore(
  userId: string,
  wordId: number,
  score: number,
  attempts: number,
  won: boolean,
  completed: boolean
) {
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
      completed,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create/update score');
  }

  return response.json();
}

export async function getUserStats(userId: string) {
  const response = await fetch(`/api/score?userId=${encodeURIComponent(userId)}`);

  if (!response.ok) {
    throw new Error('Failed to get user stats');
  }

  return response.json();
}

export async function getLeaderboard() {
  const response = await fetch('/api/leaderboard');

  if (!response.ok) {
    throw new Error('Failed to get leaderboard');
  }

  return response.json();
}
