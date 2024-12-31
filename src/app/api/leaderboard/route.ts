import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        scores: true,
      },
      orderBy: {
        totalScore: 'desc',
      },
    });

    if (!users) {
      return NextResponse.json([], { status: 200 });
    }

    const leaderboardData = users.map(user => {
      const avgScore = user.scores.length > 0
        ? user.scores.reduce((sum, score) => sum + score.score, 0) / user.scores.length
        : 0;
      
      const avgTime = user.scores
        .filter(score => score.timeTaken !== null)
        .reduce((sum, score) => sum + (score.timeTaken || 0), 0) / 
        (user.scores.filter(score => score.timeTaken !== null).length || 1);
      
      const totalHints = user.scores
        .reduce((sum, score) => sum + (score.hintsUsed || 0), 0);

      return {
        email: user.email,
        totalScore: user.totalScore,
        totalGames: user.totalGames,
        gamesWon: user.gamesWon,
        winRate: user.totalGames > 0 ? (user.gamesWon / user.totalGames * 100).toFixed(1) : '0.0',
        currentStreak: user.currentStreak,
        averageScore: Math.round(avgScore),
        averageTime: Math.round(avgTime),
        totalHints: totalHints,
      };
    });

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
