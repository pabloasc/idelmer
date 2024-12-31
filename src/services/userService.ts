import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export async function createOrUpdateUser(supabaseUser: User) {
  try {
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

    return response.json();
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    throw error;
  }
}

interface ScoreData {
  wordId: number;
  score: number;
  attempts: number;
  won: boolean;
  timeTaken: number;
  hintsUsed: number;
}

async function fetchUserStats(userId: string) {
  try {
    const response = await fetch(`/api/user?userId=${userId}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch user stats:', errorData);
      throw new Error('Failed to fetch user stats');
    }
    return response.json();
  } catch (error) {
    console.error('Error in fetchUserStats:', error);
    throw error;
  }
}


async function updateUserStats(userId: string, score: number, won: boolean) {
  try {
    const user = await fetchUserStats(userId);

    const updateResponse = await fetch(`/api/user?userId=${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        totalScore: (user.totalScore || 0) + score,
        totalGames: user.totalGames + 1,
        gamesWon: user.gamesWon + (won ? 1 : 0),
        currentStreak: 0
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update user stats');
    }

    return updateResponse.json();
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}

export async function createOrUpdateScore(scoreData: ScoreData) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('No authenticated user found');
    }

    // Ensure the user exists in the database
    await createOrUpdateUser(user);

    const token = await supabase.auth.getSession().then(({ data }) => data.session?.access_token);

    const scoreResponse = await fetch('/api/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        wordId: scoreData.wordId,
        score: scoreData.score,
        attempts: scoreData.attempts,
        won: scoreData.won,
        timeTaken: scoreData.timeTaken,
        hintsUsed: scoreData.hintsUsed,
        userId: user.id,
      }),
    });

    if (!scoreResponse.ok) {
      const errorData = await scoreResponse.json();
      console.error('Failed to save score:', errorData);
      throw new Error('Failed to save score');
    }

    const score = await scoreResponse.json();

    await updateUserStats(user.id, scoreData.score, scoreData.won);

    return score;
  } catch (error) {
    console.error('Error in createOrUpdateScore:', error);
    throw error;
  }
}

export async function getUserStats(userId: string) {
  const response = await fetch(`/api/score?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user stats');
  }
  return response.json();
}

export async function getLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Failed to fetch leaderboard:', errorData);
      throw new Error('Failed to fetch leaderboard');
    }

    return response.json();
  } catch (error) {
    console.error('Error in getLeaderboard:', error);
    throw error;
  }
}
