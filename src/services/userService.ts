import { supabase } from '@/lib/supabase';
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


export const createOrUpdateScore = async (
  wordId: number,
  score: number,
  attempts: number,
  won: boolean,
  timeTaken?: number,
  hintsUsed?: number
) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No session found');
  }

  try {
    const response = await fetch('/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        wordId,
        score,
        attempts,
        won,
        timeTaken,
        hintsUsed
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save score');
    }

    return response.json();
  } catch (error) {
    console.error('Error in createOrUpdateScore:', error);
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
