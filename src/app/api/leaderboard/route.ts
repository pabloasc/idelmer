import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        email: true,
        totalGames: true,
        gamesWon: true,
        scores: {
          select: {
            score: true,
          },
        },
      },
    });

    // Calculate highest score for each user from their scores
    const processedLeaderboard = leaderboard.map(user => {
      const highestScore = user.scores.length > 0
        ? Math.max(...user.scores.map(s => s.score))
        : 0;

      return {
        email: user.email,
        highestScore,
        totalGames: user.totalGames,
        gamesWon: user.gamesWon,
      };
    });

    // Sort by highest score in descending order
    const sortedLeaderboard = processedLeaderboard.sort((a, b) => b.highestScore - a.highestScore);

    // Take top 10 players
    const top10 = sortedLeaderboard.slice(0, 10);

    return NextResponse.json(top10);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
